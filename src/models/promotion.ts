export interface Promotion {
  id:         number;
  name:       string;
  code?:       string;
  value:      number;
  autoApply:  boolean;
  duration:   number;
  active:     boolean;
}
