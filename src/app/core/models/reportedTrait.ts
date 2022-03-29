import { Provenance } from './provenance';

export interface ReportedTrait {
  diseaseTraitId: string;
  trait: string;
  created: Provenance;
}
