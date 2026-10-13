import dims from "./imageDims.json";

export type AssetName = keyof typeof dims;

/** src + intrinsic size for a rendered asset, so next/image reserves the exact box. */
export function asset(name: AssetName) {
  const d = dims[name];
  return { src: `/img/${name}.webp`, width: d.w, height: d.h };
}
