"""
AI Watcher Service
Monitors file changes and triggers re-indexing
"""

import os
from typing import Dict
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from config.aiConfig import WATCHER_CONFIG
from utils.fileUtils import should_process_file, calculate_file_hash
from utils.logger import get_logger

logger = get_logger(__name__)


class FileChangeHandler(FileSystemEventHandler):
    """Handler for file system events"""

    def __init__(self, on_file_change):
        self.on_file_change = on_file_change
        self.debounce_timers = {}

    def on_modified(self, event):
        """Handle file modification"""
        if not event.is_directory and should_process_file(event.src_path):
            logger.debug(f"File modified: {event.src_path}")
            self.on_file_change(event.src_path, 'modified')

    def on_created(self, event):
        """Handle file creation"""
        if not event.is_directory and should_process_file(event.src_path):
            logger.debug(f"File created: {event.src_path}")
            self.on_file_change(event.src_path, 'created')

    def on_deleted(self, event):
        """Handle file deletion"""
        if not event.is_directory and should_process_file(event.src_path):
            logger.debug(f"File deleted: {event.src_path}")
            self.on_file_change(event.src_path, 'deleted')


class AIWatcherService:
    """Service for monitoring file changes"""

    def __init__(self):
        self.watchers = {}
        self.observer = None
        self.debounce_timers = {}

    def start_watching(self, project_path: str):
        """Start watching project directory"""
        if not WATCHER_CONFIG['enabled']:
            logger.debug("Watcher is disabled")
            return

        if project_path in self.watchers:
            logger.debug(f"Already watching project: {project_path}")
            return

        logger.info(f"Starting file watcher: {project_path}")

        try:
            if not self.observer:
                self.observer = Observer()
                self.observer.start()

            handler = FileChangeHandler(self.handle_file_change)
            watch = self.observer.schedule(handler, project_path, recursive=True)
            self.watchers[project_path] = watch

            logger.info(f"File watcher started: {project_path}")
        except Exception as e:
            logger.error(f"Error starting watcher: {project_path}, {str(e)}")

    def stop_watching(self, project_path: str):
        """Stop watching project"""
        watch = self.watchers.get(project_path)
        if watch:
            self.observer.unschedule(watch)
            del self.watchers[project_path]
            logger.info(f"Stopped watching project: {project_path}")

    def stop_all_watchers(self):
        """Stop all watchers"""
        if self.observer:
            self.observer.stop()
            self.observer.join()
            self.watchers.clear()
            logger.info("Stopped all file watchers")

    def handle_file_change(self, file_path: str, event_type: str):
        """Handle file change event"""
        logger.debug(f"File change detected: {file_path}, type: {event_type}")

        # Debounce the processing
        debounce_key = file_path
        if debounce_key in self.debounce_timers:
            import threading
            self.debounce_timers[debounce_key].cancel()

        def process_change():
            self.process_file_change(file_path, event_type)
            if debounce_key in self.debounce_timers:
                del self.debounce_timers[debounce_key]

        import threading
        timer = threading.Timer(WATCHER_CONFIG['debounce_ms'] / 1000, process_change)
        self.debounce_timers[debounce_key] = timer
        timer.start()

    def process_file_change(self, file_path: str, event_type: str):
        """Process file change"""
        try:
            logger.info(f"Processing file change: {file_path}, type: {event_type}")

            if event_type == 'deleted':
                logger.info(f"File deleted: {file_path}")
            else:
                # Re-ingest the file
                file_hash = calculate_file_hash(file_path)
                logger.info(f"File hash: {file_path}, hash: {file_hash}")

        except Exception as e:
            logger.error(f"Error processing file change: {file_path}, {str(e)}")

    def get_status(self) -> Dict:
        """Get watcher status"""
        return {
            'enabled': WATCHER_CONFIG['enabled'],
            'watching_projects': len(self.watchers),
            'projects': list(self.watchers.keys()),
        }
