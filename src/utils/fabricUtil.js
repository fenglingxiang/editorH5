import { FabricImage, Control } from "fabric"
import * as fabric from "fabric"

/** 加载fabric图片 */
export const loadFabricImage = async (
  URL,
  option,
) =>
  FabricImage.fromURL(
    URL,
    {
      crossOrigin: 'anonymous'
    },
    {
      ...option,
    },
  );

export const initImgOptions = (fabricImage, options = {}) => {
  const { width, offsetTop } = options
  const scaleRate =
    fabricImage.width > fabricImage.height
      ? width / fabricImage.height
      : width / fabricImage.width;
  let left = 0;
  let top = 0;
  if (fabricImage.width >= fabricImage.height) {
    left = (width - fabricImage.width * scaleRate) / 2;
  } else {
    top = (width - fabricImage.height * scaleRate) / 2;
  }
  fabricImage.set({
    left,
    top: top + offsetTop,
    angle: 0,
  });
  fabricImage.scale(scaleRate);
  fabricImage.setCoords();
  return fabricImage;
};

export const renderControlIcon = (fabricImage, icon, controlKey, options = {}) => {
  const keys = {
    "bl": { x: -0.5, y: 0.5 },
    "br": { x: 0.5, y: 0.5 },
    "mb": { x: 0, y: 0.5 },
    "ml": { x: -0.5, y: 0 },
    "mr": { x: 0.5, y: 0 },
    "mt": { x: 0, y: -0.5 },
    "mtr": { x: 0, y: -0.5 },
    "tl": { x: -0.5, y: -0.5 },
    "tr": { x: 0.5, y: -0.5 },
  }
  const img = new Image();
  img.src = icon;
  img.onload = () => {
    fabricImage.controls[controlKey] = new Control({
      x: keys[controlKey].x,
      y: keys[controlKey].y,
      ...options,
      render: (ctx, left, top, _styleOverride, fabricObject) =>
        renderIcon(ctx, left, top, _styleOverride, fabricObject, img, options.cornerSize),
      ...options
    });
  }
}

const renderIcon = (ctx, left, top, _styleOverride, fabricObject, img, size) => {
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};