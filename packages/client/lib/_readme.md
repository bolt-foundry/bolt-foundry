The lib directories store typescript components used through the codebase. There
are three lib directories so far. The lib directory that a component should go
in is determined by its dependencies.

If the component or file imports app level dependencies, it should go in
packages/lib, if it imports client or frontend dependencies it should go in
packages/client/lib. If the component doesn't import any dependencies, or
imports dependencies from the top level lib, then it will go in /lib
