import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectInfoCard } from './ProjectInfoCard';
import { TechnologyCard } from './TechnologyCard';
import { ScopeCard } from './ScopeCard';
import { DescriptionCard } from './DescriptionCard';
import { ProjectList } from './ProjectList';
import { parseResponseContent } from './parseResponseContent';
import { FeatureChip } from './FeatureChip';
import { FiZap } from 'react-icons/fi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export const AIResponseCard = ({ message, intent }) => {
  const project = useMemo(() => {
    if (message.data?.project?.projectName) {
      const p = message.data.project;
      const tech = p.technologies || message.data.technologies || {};
      return {
        ...p,
        technologies: {
          frontend: tech.frontend || [],
          backend: tech.backend || [],
          database: tech.database || [],
          tools: tech.tools || tech.other || [],
        },
      };
    }
    return parseResponseContent(message.content);
  }, [message]);

  const resolvedIntent = intent || message.intent;
  const sections = message.data?.sections;

  const isProjectList = message.responseType === 'project_list' || (message.data?.projects?.length > 0 && !message.data?.project?.projectName);

  if (isProjectList) {
    return <ProjectList projects={message.data.projects} />;
  }

  if (!project) return null;

  const showFullDetails = ['project_details', 'proposal', 'project_proposal', 'proposal_details'].includes(
    resolvedIntent
  );
  const showTechOnly = ['project_technologies', 'frontend_technology', 'backend_technology', 'database_technology', 'technologies'].includes(
    resolvedIntent
  );
  const showCostOnly = resolvedIntent === 'project_cost';
  const showScopeOnly = resolvedIntent === 'project_scope';
  const showStatusOnly = resolvedIntent === 'project_status';

  const features = [...(project.features || []), ...(project.customFeatures || [])].filter(Boolean);
  const scope = project.scopeOfWork || [];
  const description = project.description || project.summary || project.projectDetails;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 w-full max-w-full overflow-hidden">
      {(showFullDetails || showCostOnly || showStatusOnly) && (
        <ProjectInfoCard
          project={project}
          title={showCostOnly ? 'Project Cost' : showStatusOnly ? 'Project Status' : '🤖 Project Details'}
          compact={showCostOnly || showStatusOnly}
          index={0}
        />
      )}

      {(showFullDetails || showTechOnly) && (
        <TechnologyCard
          sections={sections}
          technologies={project.technologies}
          projectName={!showFullDetails ? project.projectName : undefined}
          index={1}
        />
      )}

      {showFullDetails && features.length > 0 && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-950/25 to-slate-900/60 backdrop-blur-md p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FiZap className="text-fuchsia-400" size={16} />
            <h4 className="text-sm font-semibold text-white">Features</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <FeatureChip key={f} label={f} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {(showFullDetails || showScopeOnly) && <ScopeCard items={scope} index={2} />}

      {showFullDetails && <DescriptionCard text={description} index={3} />}
    </motion.div>
  );
};
