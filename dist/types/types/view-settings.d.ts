/**
 * Unified ViewSettings type for all view-related configuration in epub.js
 */
import type { Axis, Flow, Direction } from '../enums';
import type Layout from '../layout';
export interface ViewSettings {
    ignoreClass?: string;
    axis?: Axis;
    direction?: Direction;
    width: number;
    height: number;
    layout?: Layout;
    method?: string;
    forceRight?: boolean;
    allowScriptedContent?: boolean;
    allowPopups?: boolean;
    transparency?: boolean;
    forceEvenPages?: boolean;
    flow?: Flow;
}
