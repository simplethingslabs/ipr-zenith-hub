/**
 * WhatsApp call-to-action.
 *
 * This replaced the server-backed contact form. The form POSTed to
 * `/api/contact`, which meant the site's primary conversion path depended on a
 * database being reachable — and when it wasn't, submissions failed with a
 * generic toast and were lost silently. A `wa.me` link has no backend, cannot
 * fail, and drops the visitor into a channel the firm already monitors.
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { whatsappUrl } from '@/content/site';

/** WhatsApp's glyph is not in lucide-react, so it is inlined here. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.057-.371-.058-.52-.115-.148-.657-1.583-.9-2.163-.235-.567-.475-.492-.653-.5-.169-.008-.362-.01-.555-.01a1.07 1.07 0 0 0-.777.363c-.267.298-1.02 1-1.02 2.435 0 1.436 1.045 2.822 1.19 3.02.15.198 2.06 3.145 4.99 4.41.696.3 1.24.48 1.664.615.7.222 1.336.19 1.84.115.56-.083 1.72-.703 1.963-1.382.242-.68.242-1.262.17-1.384-.073-.123-.267-.198-.564-.347Zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.894 6.994c-.003 5.45-4.437 9.884-9.886 9.884Zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

interface WhatsAppCtaProps {
  /** Prefilled message. Give each page a specific one so enquiries arrive with context. */
  message?: string;
  children?: React.ReactNode;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'accent' | 'outline-light';
  className?: string;
}

export function WhatsAppCta({
  message,
  children = 'Chat on WhatsApp',
  size = 'default',
  variant = 'accent',
  className,
}: WhatsAppCtaProps) {
  return (
    <Button
      asChild
      size={size}
      className={cn(
        variant === 'accent' && 'bg-accent text-accent-foreground hover:bg-accent/90',
        variant === 'outline-light' &&
          'border border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary',
        className,
      )}
    >
      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="mr-2 h-4 w-4" />
        {children}
      </a>
    </Button>
  );
}

export { WhatsAppIcon };
