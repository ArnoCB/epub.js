/**
 * Types for ViewManager and ViewManagerConstructor in epub.js
 *
 * Used by view manager helpers and related logic.
 */

import type Layout from '../layout';
import type { Stage, Views, View } from '../managers';
import type { Section } from '../section';
import type { Axis, Flow } from '../enums';
import type { PageLocation } from '.';
import type { Contents } from '../epub';
import type { EventEmitterMethods } from '.';

export interface ViewManagerConstructor extends ViewManager {
  new (options: { [key: string]: unknown }): ViewManager;
}

export interface ViewManager {
  // on(event: string, listener: (...args: unknown[]) => void): EventEmitterMethods;
  // off(event: string, listener: (...args: unknown[]) => void): EventEmitterMethods;

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
  on: EventEmitterMethods['on'];
  off: EventEmitterMethods['off'];
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
  visible(): View[];
}
