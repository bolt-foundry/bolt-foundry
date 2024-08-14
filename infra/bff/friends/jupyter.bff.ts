import { registerShellCommand } from "infra/bff/shellBase.ts";

registerShellCommand("jupyter", "start a jupyter notebook",["jupyter", "notebook", "--config", "infra/jupyter/jupyter_config.py", ], false)
