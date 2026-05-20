import { useState, useCallback, useRef, useEffect } from 'react';
import { searchService } from '../services/searchService';

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimerRef = useRef(null);

  const fetchKnowledgeBase = useCallback(async () => {
    try {
      const data = await searchService.getKnowledgeBase().catch(() => ({
        projects: searchService.getMockKnowledgeBase(),
      }));
      setKnowledgeBase(data.projects || []);
    } catch (err) {
      console.error('Error fetching knowledge base:', err);
      setKnowledgeBase(searchService.getMockKnowledgeBase());
    }
  }, []);

  const performSearch = useCallback(async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchService.semanticSearch(searchQuery, { page: pageNum, limit: 10 }).catch(() => ({
        results: searchService.getMockSearchResults(searchQuery),
        pagination: { page: 1, pages: 1 },
      }));
      
      setResults(data.results || []);
      setTotalPages(data.pagination?.pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
      setResults(searchService.getMockSearchResults(searchQuery));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((searchQuery) => {
    setQuery(searchQuery);
    
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery, 1);
    }, 300);
  }, [performSearch]);

  const goToPage = useCallback((pageNum) => {
    performSearch(query, pageNum);
  }, [query, performSearch]);

  useEffect(() => {
    fetchKnowledgeBase();
  }, [fetchKnowledgeBase]);

  return {
    results,
    knowledgeBase,
    loading,
    error,
    query,
    page,
    totalPages,
    handleSearch,
    goToPage,
    refetchKnowledgeBase: fetchKnowledgeBase,
  };
};
