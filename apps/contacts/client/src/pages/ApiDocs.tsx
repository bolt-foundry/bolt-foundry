import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";

export default function ApiDocs() {
  const { user } = useAuth();
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    // Get base URL
    const url = new URL(window.location.href);
    const baseUrl = `${url.protocol}//${url.host}`;
    setBaseUrl(baseUrl);

    // Fetch API key for documentation
    const fetchApiKey = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/config`);
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
  }, []);

  const endpointData = [
    {
      method: "GET",
      endpoint: "/api/contacts",
      description: "Retrieve all contacts",
      requestBody: null,
      responses: [
        {
          code: 200,
          description: "Success",
          example:
            '[{"id":1,"name":"Dan Sisco","email":"dan@example.com","company":"Bolt Foundry","contacted":false,"createdAt":"2023-03-28T00:00:00.000Z"}]',
        },
        {
          code: 401,
          description: "Unauthorized",
          example: '{"success":false,"message":"API key is missing"}',
        },
        {
          code: 403,
          description: "Forbidden",
          example: '{"success":false,"message":"Invalid API key"}',
        },
      ],
    },
    {
      method: "POST",
      endpoint: "/api/contacts",
      description: "Create a new contact",
      requestBody:
        '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "company": "Example Inc"\n}',
      responses: [
        {
          code: 201,
          description: "Created",
          example:
            '{"id":2,"name":"John Doe","email":"john@example.com","company":"Example Inc","contacted":false,"createdAt":"2023-03-28T00:00:00.000Z"}',
        },
        {
          code: 400,
          description: "Bad Request",
          example: '{"message":"Validation error: Required"}',
        },
        {
          code: 401,
          description: "Unauthorized",
          example: '{"success":false,"message":"API key is missing"}',
        },
        {
          code: 403,
          description: "Forbidden",
          example: '{"success":false,"message":"Invalid API key"}',
        },
      ],
    },
    {
      method: "PATCH",
      endpoint: "/api/contacts/:id",
      description: "Update a contact (mark as contacted/not contacted)",
      requestBody: '{\n  "contacted": true\n}',
      responses: [
        {
          code: 200,
          description: "Success",
          example:
            '{"id":1,"name":"Dan Sisco","email":"dan@example.com","company":"Bolt Foundry","contacted":true,"createdAt":"2023-03-28T00:00:00.000Z"}',
        },
        {
          code: 400,
          description: "Bad Request",
          example: '{"message":"Invalid contact ID"}',
        },
        {
          code: 401,
          description: "Unauthorized",
          example: '{"success":false,"message":"API key is missing"}',
        },
        {
          code: 403,
          description: "Forbidden",
          example: '{"success":false,"message":"Invalid API key"}',
        },
        {
          code: 404,
          description: "Not Found",
          example: '{"message":"Contact not found"}',
        },
      ],
    },
    {
      method: "DELETE",
      endpoint: "/api/contacts/:id",
      description: "Delete a contact",
      requestBody: null,
      responses: [
        {
          code: 200,
          description: "Success",
          example: '{"message":"Contact deleted successfully"}',
        },
        {
          code: 400,
          description: "Bad Request",
          example: '{"message":"Invalid contact ID"}',
        },
        {
          code: 401,
          description: "Unauthorized",
          example: '{"success":false,"message":"API key is missing"}',
        },
        {
          code: 403,
          description: "Forbidden",
          example: '{"success":false,"message":"Invalid API key"}',
        },
        {
          code: 404,
          description: "Not Found",
          example: '{"message":"Contact not found"}',
        },
      ],
    },
  ];

  const CodeBlock = (
    { code, language }: { code: string; language: string },
  ) => (
    <div className="bg-slate-900 text-slate-50 rounded-md p-4 overflow-x-auto mt-2">
      <pre className="text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const getFullUrl = (endpoint: string) => {
    return `${baseUrl}${endpoint}`;
  };

  const getCurlCommand = (
    method: string,
    endpoint: string,
    requestBody: string | null,
  ) => {
    const fullUrl = getFullUrl(endpoint);
    let command = `curl -X ${method} "${fullUrl}" \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json"`;

    if (requestBody) {
      command += ` \\
  -d '${requestBody}'`;
    }

    return command;
  };

  const getFetchCommand = (
    method: string,
    endpoint: string,
    requestBody: string | null,
  ) => {
    const fullUrl = getFullUrl(endpoint);
    let options = `{
  method: "${method}",
  headers: {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
  }`;

    if (requestBody) {
      options += `,
  body: '${requestBody}'`;
    }

    options += `
}`;

    return `fetch("${fullUrl}", ${options})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
  };

  const methodColors: Record<string, string> = {
    "GET": "bg-blue-500",
    "POST": "bg-green-500",
    "PATCH": "bg-yellow-500",
    "DELETE": "bg-red-500",
  };

  const EndpointCard = (
    { endpoint: { method, endpoint, description, requestBody, responses } }: {
      endpoint: typeof endpointData[0];
    },
  ) => {
    const endpointWithId = endpoint.includes(":id")
      ? endpoint.replace(":id", "1") // Replace with example ID
      : endpoint;

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge
                className={`${methodColors[method]} hover:${
                  methodColors[method]
                }`}
              >
                {method}
              </Badge>
              <CardTitle className="text-xl font-mono">
                {endpointWithId}
              </CardTitle>
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Full URL</h3>
              <div className="bg-slate-100 p-2 rounded font-mono text-sm">
                {getFullUrl(endpointWithId)}
              </div>
            </div>

            <Tabs defaultValue="curl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Request Examples</h3>
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="fetch">Fetch</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="curl">
                <CodeBlock
                  language="bash"
                  code={getCurlCommand(method, endpointWithId, requestBody)}
                />
              </TabsContent>

              <TabsContent value="fetch">
                <CodeBlock
                  language="javascript"
                  code={getFetchCommand(method, endpointWithId, requestBody)}
                />
              </TabsContent>
            </Tabs>

            {requestBody && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Request Body</h3>
                <CodeBlock language="json" code={requestBody} />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-2">Responses</h3>
              <div className="space-y-3">
                {responses.map((response, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={response.code >= 200 && response.code < 300
                          ? "default"
                          : (response.code >= 400 ? "destructive" : "outline")}
                      >
                        {response.code}
                      </Badge>
                      <span className="text-sm font-medium">
                        {response.description}
                      </span>
                    </div>
                    <CodeBlock language="json" code={response.example} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-gray-600 mb-4">
            This page provides documentation for the Bolt Foundry CMS API
            endpoints and configuration.
          </p>

          <Tabs defaultValue="api">
            <TabsList className="mb-4">
              <TabsTrigger value="api">API Authentication</TabsTrigger>
              <TabsTrigger value="email">Email Configuration</TabsTrigger>
              <TabsTrigger value="deployment">Deployment Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="api">
              <div className="bg-slate-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Authentication</h2>
                <p className="mb-2">
                  All API requests require authentication using an API key. The
                  API key should be included in the request headers.
                </p>
                <div className="bg-slate-200 p-2 rounded">
                  <code className="text-sm">x-api-key: {apiKey}</code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="bg-slate-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">
                  Email Configuration
                </h2>
                <p className="mb-4">
                  The Bolt Foundry CMS application can send emails for account
                  verification. You can configure it to use Gmail as your email
                  provider by following these steps:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-md mb-1">
                      Step 1: Enable Less Secure Apps or Generate App Password
                    </h3>
                    <p className="text-sm mb-2">
                      For Gmail, you need to either:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                      <li>
                        Enable 2-Step Verification and generate an App Password
                        (recommended)
                      </li>
                      <li>
                        Or enable Less Secure Apps (not recommended for security
                        reasons)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-md mb-1">
                      Step 2: Generate App Password (if using 2-Step
                      Verification)
                    </h3>
                    <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                      <li>
                        Go to your{" "}
                        <a
                          href="https://myaccount.google.com/security"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Google Account Security page
                        </a>
                      </li>
                      <li>Ensure 2-Step Verification is enabled</li>
                      <li>Scroll down to "App passwords"</li>
                      <li>Select "Mail" as the app and your device</li>
                      <li>Click "Generate"</li>
                      <li>Save the 16-character password that appears</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-md mb-1">
                      Step 3: Configure Environment Variables
                    </h3>
                    <p className="text-sm mb-2">
                      Set the following environment variables in your Replit:
                    </p>
                    <div className="bg-slate-200 p-3 rounded text-sm font-mono">
                      <p>EMAIL_HOST=smtp.gmail.com</p>
                      <p>EMAIL_PORT=587</p>
                      <p>EMAIL_USER=your.email@gmail.com</p>
                      <p>EMAIL_PASS=your-app-password</p>
                      <p>EMAIL_FROM=your.email@gmail.com</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-md mb-1">
                      Step 4: Restart the Application
                    </h3>
                    <p className="text-sm">
                      After setting the environment variables, restart your
                      application to apply the changes.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deployment">
              <div className="bg-slate-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Deployment Guide</h2>
                <p className="mb-4">
                  When deploying this application, ensure that you have
                  configured the following environment variables:
                </p>

                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-md">
                    Required Environment Variables:
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>
                      <strong>API_KEY</strong>: Your API key for authenticating
                      API requests
                    </li>
                    <li>
                      <strong>DATABASE_URL_CONTACTS</strong>: PostgreSQL
                      connection URL
                    </li>
                    <li>
                      <strong>SESSION_SECRET</strong>: Secret key for session
                      management
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-md">
                    Optional Email Configuration:
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>
                      <strong>EMAIL_HOST</strong>: SMTP server address
                    </li>
                    <li>
                      <strong>EMAIL_PORT</strong>: SMTP server port
                    </li>
                    <li>
                      <strong>EMAIL_USER</strong>: SMTP username/email
                    </li>
                    <li>
                      <strong>EMAIL_PASS</strong>: SMTP password
                    </li>
                    <li>
                      <strong>EMAIL_FROM</strong>: From address for sent emails
                    </li>
                    <li>
                      <strong>PUBLIC_URL</strong>: Public URL of the deployed
                      application (used for email links)
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Endpoints</h2>
          <Separator className="my-4" />

          <div>
            {endpointData.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
