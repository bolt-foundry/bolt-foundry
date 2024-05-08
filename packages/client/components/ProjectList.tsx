import { React, ReactRelay } from "deps.ts";
import { colors } from "packages/bfDs/const.tsx";
// import { ProjectList_me$key } from "packages/__generated__/ProjectList_me.graphql.ts";
// import {
//   ProjectListItem_Project$key,
// } from "packages/__generated__/ProjectListItem_Project.graphql.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { DeleteProjectButton } from "packages/client/components/DeleteProjectButton.tsx";

const styles: Record<string, React.CSSProperties> = {
  currentProject: {
    backgroundColor: colors.highlight,
    color: colors.secondaryColor,
  },
  item: {
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 14,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
  },
  itemHovered: {
    backgroundColor: colors.itemDarkHovered,
  },
  listStyle: {},
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
};

// const projectListFragment = await graphql`
//   fragment ProjectList_me on Person {
//     projects(first: 30)
//     @connection(key: "ProjectList_projects")
//     {
//       edges {
//         node {
//           id
//           ...ProjectListItem_Project
//         }
//       }
//     }
//   }
// `;

// const projectListItemFragment = await graphql`
//   fragment ProjectListItem_Project on Project {
//     id
//     name
//   }
// `;

// const subscriptionFragment = await graphql`
//   subscription ProjectListItemSubscription($id: ID!) {
//     project(id: $id) {
//       ...ProjectListItem_Project
//     }
//   }
// `;

function ProjectListItem(
  { project$key }: { project$key: ProjectListItem_Project$key },
) {
  const { navigate } = useRouter();
  const [hovered, setHovered] = React.useState(false);
  // const project = ReactRelay.useFragment(
  //   // projectListItemFragment,
  //   project$key,
  // );
  const project = { id: "1", name: "test" };
  // const subscriptionConfig: GQLSubConfigOperationType = React.useMemo(
  //   () => ({
  //     variables: { id: project.id },
  //     subscription: subscriptionFragment,
  //     updater: (store) => {
  //       const newProject = store.getRootField("project");
  //       store.getRoot().setLinkedRecord(newProject, "project", {
  //         id: project.id,
  //       });
  //     },
  //   }),
  //   [project.id],
  // );
  // ReactRelay.useSubscription(subscriptionConfig);
  const { routeParams } = useRouter();

  const currentProjectId = routeParams.projectId;
  const isCurrentProject = project.id === currentProjectId;

  return (
    <div
      className="project-list-item"
      style={{
        ...styles.item,
        ...(hovered && styles.itemHovered),
        ...(isCurrentProject && styles.currentProject),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${project.id}`)}
      data-bf-testid="list-item-project"
    >
      <div className="project-title" style={styles.title}>
        {project.name ?? "Untitled"}
      </div>
      {isCurrentProject && (
        <div style={{ margin: -2 }}>
          <DeleteProjectButton
            size="small"
            projectId={project.id}
            testId="delete-project-list-item"
          />
        </div>
      )}
    </div>
  );
}

type Props = {
  person$key: ProjectList_me$key;
};

export function ProjectList({ person$key }: Props) {
  // const data = ReactRelay.useFragment(projectListFragment, person$key);
  const data = {
    projects: { edges: [{ id: 1, node: { id: 1 } }] },
  };
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
    return project && (
      <ProjectListItem
        key={project.id}
        project$key={project}
      />
    );
  });
  return (
    <div className="project-list" style={styles.listStyle}>
      {projectElements}
    </div>
  );
}
