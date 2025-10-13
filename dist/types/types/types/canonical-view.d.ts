import Section from '../section';
import Contents from '../contents';
import Layout from '../layout';

export interface ViewSettings {
  ignoreClass?: string;
  axis?: string;
  flow?: string;
  layout?: Layout;
  method?: string;
  width?: number;
  height?: number;
  forceEvenPages?: boolean;
  allowScriptedContent?: boolean;
}

export default class CanonicalView {
  constructor(section: Section, options: ViewSettings);
}
