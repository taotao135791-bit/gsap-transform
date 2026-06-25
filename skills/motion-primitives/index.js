// barrel — single export surface for all primitives.

import fadeUp from "./fadeUp.js";
import fadeIn from "./fadeIn.js";
import scaleIn from "./scaleIn.js";
import slideInLeft, { slideInRight } from "./slideIn.js";
import splitReveal from "./splitReveal.js";
import typewriter from "./typewriter.js";
import scrambleText from "./scrambleText.js";
import morphTo from "./morphTo.js";
import drawOn from "./drawOn.js";
import parallaxY from "./parallaxY.js";
import staggerIn from "./staggerIn.js";
import loopPulse from "./loopPulse.js";
import shake from "./shake.js";
import cameraPush from "./cameraPush.js";
import hold from "./hold.js";

export const primitives = {
  fadeUp, fadeIn, scaleIn,
  slideInLeft, slideInRight,
  splitReveal, typewriter, scrambleText,
  morphTo, drawOn,
  parallaxY, staggerIn,
  loopPulse, shake, cameraPush, hold
};

export const primitiveNames = Object.keys(primitives);

export function get(name) {
  const p = primitives[name];
  if (!p) throw new Error(`unknown primitive: ${name}`);
  return p;
}