export function getSubVariant(sub_variant: number): string {
  switch (sub_variant) {
    case 0: return "standard";
    case 1: return "fairy v1";
    case 2: return "fairy v2";
    case 3: return "standard + placement";
    default: return "//";
  }
}