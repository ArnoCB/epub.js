/**
 * Types for ViewManager and ViewManagerConstructor in epub.js
 *
 * Used by view manager helpers and related logic.
 */

import type Layout from '../layout';
import type { Stage } from './stage';
import type { Views } from './views';
import type { Section } from '../section';
import type { Axis, Flow } from '../types';
import type { PageLocation } from '../types/view-manager';
import type { Contents } from '../epub';
import type EventEmitter from 'event-emitter';

export interface ViewManagerConstructor extends ViewManager {
  new (options: { [key: string]: unknown }): ViewManager;
}

export interface ViewManager {
  on(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  off(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  settings: {
    infinite?: boolean;
    hidden?: boolean;
    width?: number;
    height?: number;
    axis?: Axis;
    writingMode?: string;
    flow?: Flow;
    ignoreClass?: string;
    fullsize?: boolean;
    allowScriptedContent?: boolean;
    allowPopups?: boolean;
    overflow?: unknown;
    offset?: number;
    afterScrolledTimeout?: number;
    gap?: number;
    layout: Layout;
    [key: string]: unknown;
  };
  stage: Stage;
  isPaginated?: boolean;
  overflow?: unknown;
  views: Views;
  on(event: string, listener: (...args: unknown[]) => void): EventEmitter;
  container?: HTMLElement;
  display: (
    section: Section,
    target?: HTMLElement | string
  ) => Promise<unknown>;
  render: (
    element: HTMLElement,
    size?: { width: number; height: number }
  ) => void;
  destroy: () => void;
  clear: () => void;
  resize: (width?: string, height?: string, epubcfi?: string) => void;
  prev: () => Promise<void>;
  next: () => Promise<void>;
  applyLayout: (layout: Layout) => void;
  updateFlow: (flow: Flow, defaultScrolledOverflow?: string) => void;
  isRendered: () => boolean;
  updateLayout: () => void;
  direction: (dir?: string) => void;
  currentLocation: () => PageLocation[];
  getContents(): Contents[];
}
