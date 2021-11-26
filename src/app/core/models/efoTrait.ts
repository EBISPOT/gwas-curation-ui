import { Provenance } from './provenance';

export interface EfoTrait {
  efoTraitId: string;
  trait: string;
  shortForm: string;
  uri: string;
  created: Provenance;
  edited: Provenance;
}
