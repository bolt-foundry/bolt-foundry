import os

c.ServerApp.ip = '0.0.0.0'
c.ServerApp.allow_origin = '*'
c.ServerApp.open_browser = False
c.ServerApp.token = 'bfjupyter'
c.ServerApp.password = ''
c.ServerApp.allow_remote_access = True
c.ServerApp.terminado_settings = {'shell_command': ['/bin/bash']}
c.ServerApp.tornado_settings = {
    'headers': {
        'Content-Security-Policy': "frame-ancestors 'self' https://replit.com"
    }
}

c.ServerApp.root_dir = "."
c.ServerApp.port = 8888
c.ServerApp.port_retries = 0

c.ServerApp.shutdown_no_confirm = True
c.MappingKernelManager.default_kernel_name = 'deno'