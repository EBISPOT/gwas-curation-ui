import { ReportedTrait } from './reportedTrait';
import { EfoTrait } from './efoTrait';

export interface Study {
  studyId: string;
  study_tag: string;
  study_accession: string;
  genotyping_technology: string;
  array_manufacturer: string;
  array_information: string;
  imputation: boolean;
  variant_count: number;
  sample_description: string;
  statistical_model: string;
  study_description: string;
  trait: string;
  efo_trait: string;
  background_trait: string;
  background_efo_trait: string;
  checksum: string;
  summary_statistics_file: string;
  raw_sumstats_file: string;
  summary_statistics_assembly: string;
  readme_file: string;
  cohort: string;
  cohort_id: string;
  // associations: Association[];
  // samples: Sample[];
  // notes: Note[];
  agreedToCc0: boolean;
  diseaseTrait: ReportedTrait;
  efoTraits: EfoTrait[];
  sumstats_flag: boolean;
  pooled_flag: boolean;
  gxe_flag: boolean;
}
