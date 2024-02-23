export const envDevTemplateData = (options: { [k: string]: any }) =>
    `\n# APP ${options.xm_upper_name}\nNX_${options.xm_upper_name}_DOMAIN=http://127.0.0.1\nNX_${
        options.xm_upper_name
    }_BASE_URL=/\nNX_${options.xm_upper_name}_PORT=${options.port ?? 4200}\nNX_${options.xm_upper_name}_PATH=${
        options.name
    }\n`;

export const envTemplateData = (options: { [k: string]: any }) =>
    `\n# APP ${options.xm_upper_name}\nNX_${options.xm_upper_name}_DOMAIN=\nNX_${options.xm_upper_name}_BASE_URL=/${options.name}/\nNX_${options.xm_upper_name}_PATH=\n`;

export const nginxTemplateData = (options: { [k: string]: any }) => `\nlocation /${options.name} {
    alias /usr/share/nginx/${options.name}/;
    index index.html index.htm;
    try_files $uri $uri/ /${options.name}/index.html;
}\n`;
