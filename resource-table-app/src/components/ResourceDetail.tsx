'use client';

import React from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ResourceDocument, ProcessingState } from '@/types/resource';
import { formatRelativeTime } from '@/lib/date-utils';

interface ResourceDetailProps {
  resource: ResourceDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getStateVariant(state: ProcessingState): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (state) {
    case ProcessingState.PROCESSING_STATE_COMPLETED:
      return 'default';
    case ProcessingState.PROCESSING_STATE_PROCESSING:
      return 'secondary';
    case ProcessingState.PROCESSING_STATE_FAILED:
      return 'destructive';
    default:
      return 'outline';
  }
}

function formatState(state: ProcessingState): string {
  return state.replace('PROCESSING_STATE_', '').replace('_', ' ').toLowerCase();
}

export const ResourceDetail = React.memo<ResourceDetailProps>(function ResourceDetail({ resource, open, onOpenChange }) {
  if (!resource) return null;

  const { resource: ehrResource } = resource;
  const { metadata } = ehrResource;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[640px] px-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {metadata.resourceType}
            <Badge variant={getStateVariant(metadata.state)}>
              {formatState(metadata.state)}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Resource details and metadata
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Metadata Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Metadata
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Patient ID</div>
                <div>{metadata.identifier.patientId}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Version</div>
                <div>{metadata.version.replace('FHIR_VERSION_', '')}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Created</div>
                <div>{formatRelativeTime(metadata.createdTime)}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Fetched</div>
                <div>{formatRelativeTime(metadata.fetchTime)}</div>
              </div>
              {metadata.processedTime && (
                <>
                  <div>
                    <div className="font-medium text-muted-foreground">Processed</div>
                    <div>{formatRelativeTime(metadata.processedTime)}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Human Readable Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Human Readable Summary
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {ehrResource.humanReadableStr}
              </p>
            </div>
          </div>

          {/* AI Summary Section */}
          {ehrResource.aiSummary && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                AI Summary
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-blue-900 dark:text-blue-100">
                  {ehrResource.aiSummary}
                </p>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Technical Details
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Key:</span>
                <span className="font-mono text-xs">{metadata.identifier.key}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">UID:</span>
                <span className="font-mono text-xs">{metadata.identifier.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Document ID:</span>
                <span className="font-mono text-xs">{resource.id}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});