import { NextRequest, NextResponse } from 'next/server';

import { ResendService, SendEmailParams } from '@/libs/services/email/resendService';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    error,
    message,
    success,
    timestamp: new Date().toISOString(),
  });
}

type SendEmailRequest = SendEmailParams;

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { attachments, bcc, cc, from, headers, html, react, replyTo, subject, tags, text, to } =
      body;

    // Basic validation
    if (!to || !subject) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'to and subject are required'
      );
    }

    if (!html && !text && !react) {
      return createResponse(
        false,
        'Missing email content',
        undefined,
        'At least one of html, text, or react content is required'
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to : [to];

    for (const recipient of recipients) {
      if (!emailRegex.test(recipient)) {
        return createResponse(
          false,
          'Invalid email address',
          undefined,
          `Invalid email: ${recipient}`
        );
      }
    }

    // Send email using ResendService
    const result = await ResendService.sendEmail({
      attachments,
      bcc,
      cc,
      from,
      headers,
      html,
      react,
      replyTo,
      subject,
      tags,
      text,
      to,
    });

    if (!result.success) {
      return createResponse(false, 'Failed to send email', undefined, result.error);
    }

    return createResponse(true, 'Email sent successfully', {
      emailId: result.id,
      enabledStatus: ResendService.isEmailEnabled(),
      recipients: recipients.length,
    });
  } catch (error) {
    console.error('POST /api/emails/send error:', error);
    return createResponse(
      false,
      'Failed to send email',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
