'use client';

import * as React from 'react';
import { useState } from 'react';
import { render } from '@react-email/render';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface EmailPreviewProps {
  template: React.ReactNode;
  defaultProps: Record<string, unknown>;
  sendTestEmail?: (
    to: string,
    props: Record<string, unknown>
  ) => Promise<{ success: boolean; message: string }>;
}

export function EmailPreview({
  template,
  defaultProps,
  sendTestEmail,
}: EmailPreviewProps) {
  const [props, setProps] = useState<Record<string, unknown>>(defaultProps);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

  // Update a single prop
  const updateProp = (key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  };

  // Generate HTML preview
  const generatePreview = async () => {
    try {
      // Clone the template with the current props
      const clonedTemplate = React.cloneElement(
        template as React.ReactElement,
        props as React.Attributes
      );
      const html = await render(clonedTemplate);
      setHtmlContent(html);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    if (!sendTestEmail || !testEmailAddress) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const result = await sendTestEmail(testEmailAddress, props);
      setSendResult(result);
    } catch (error) {
      setSendResult({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Template Properties</CardTitle>
          <CardDescription>
            Customize the email template properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(props).map(([key, value]) => {
              // Skip rendering certain props that shouldn't be editable
              if (key === 'children') return null;

              return (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={key}>{key}</Label>
                  {typeof value === 'string' ? (
                    value.length > 50 ? (
                      <Textarea
                        id={key}
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateProp(key, e.target.value)
                        }
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={key}
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProp(key, e.target.value)
                        }
                      />
                    )
                  ) : typeof value === 'boolean' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProp(key, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={key}>Enabled</Label>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      (Complex value - not editable)
                    </div>
                  )}
                </div>
              );
            })}

            <Button onClick={generatePreview} className="mt-4">
              Generate Preview
            </Button>

            {sendTestEmail && (
              <div className="mt-6 border-t pt-6">
                <CardTitle className="mb-4 text-lg">Send Test Email</CardTitle>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="testEmail">Email Address</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      placeholder="recipient@example.com"
                      value={testEmailAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTestEmailAddress(e.target.value)
                      }
                    />
                  </div>
                  <Button
                    onClick={handleSendTestEmail}
                    disabled={isSending || !testEmailAddress}
                  >
                    {isSending ? 'Sending...' : 'Send Test Email'}
                  </Button>

                  {sendResult && (
                    <Alert
                      className={
                        sendResult.success ? 'bg-green-50' : 'bg-red-50'
                      }
                    >
                      {sendResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertTitle>
                        {sendResult.success ? 'Success' : 'Error'}
                      </AlertTitle>
                      <AlertDescription>{sendResult.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
          <CardDescription>
            Preview how the email will look to recipients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-0">
              <div className="rounded border bg-white p-4">
                <div className="prose max-w-none">
                  {htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  ) : (
                    <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                      Click &quot;Generate Preview&quot; to see the email
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="html" className="mt-0">
              <div className="rounded border bg-slate-950 p-4">
                <pre className="max-h-[400px] overflow-auto text-xs text-white">
                  {htmlContent || 'Click "Generate Preview" to see the HTML'}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
