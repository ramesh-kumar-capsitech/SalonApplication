import { defineConfig } from 'orval';

export default defineConfig({
    authApi: {
        input: {
            target: 'https://localhost:7074/swagger/v1/swagger.json',
        },
        output: {
            mode: 'split',
            target: './src/api/generated',
            schemas: './src/api/generated/models',
            client: 'react-query',
            httpClient: 'axios',
            clean: true,
            prettier: true,
        },
    },
});