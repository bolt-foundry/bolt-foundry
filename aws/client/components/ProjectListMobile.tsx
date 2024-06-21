import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import { ProjectListMobile_me$key } from "aws/__generated__/ProjectListMobile_me.graphql.ts";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";

const styles: Record<string, React.CSSProperties> = {
  item: {
    margin: "8px 0",
  },
  currentProject: {
    fontWeight: "bold",
    color: "var(--accent)",
  },
  listTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
  projectTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 14,
  },
};

const projectListFragment = await graphql`
  fragment ProjectListMobile_me on Person {
    projects(first: 30) 
    @connection(key: "ProjectListMobile_projects")
    {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type Props = {
  person$key: Maybe<ProjectListMobile_me$key>;
  setMobileProjectListOpen: (open: boolean) => void;
};

function ProjectList({ person$key, setMobileProjectListOpen }: Props) {
  const data = ReactRelay.useFragment(projectListFragment, person$key);
  const { routeParams, navigate } = useRouter();

  const currentProjectId = routeParams.projectId;
  const projects = data?.projects?.edges;
  // Check if projects is defined and filter out any null elements
  const validProjects = projects?.filter(Boolean);
  // Sort the projects by id descending
  const sortedProjects = validProjects?.sort((a, b) => {
    const idA = a?.node?.id ?? "";
    const idB = b?.node?.id ?? "";
    if (idA < idB) return 1;
    if (idA > idB) return -1;
    return 0;
  });
  const projectElements = sortedProjects?.map((projectEdge) => {
    const project = projectEdge?.node;
    const isCurrentProject = project && project.id === currentProjectId;
    return project && (
      <div
        key={project.id}
        style={{
          ...styles.item,
          ...(isCurrentProject && styles.currentProject),
        }}
        onClick={() => {
          setMobileProjectListOpen(false);
          navigate(`/projects/${project.id}`);
        }}
      >
        <div style={styles.projectTitle}>
          {project?.name ?? "Untitled"}
        </div>
      </div>
    );
  });
  return (
    <div className="project-list" style={styles.listStyle}>
      <div style={styles.listTitle}>
        Projects
      </div>
      {projectElements}
    </div>
  );
}

export default ProjectList;
