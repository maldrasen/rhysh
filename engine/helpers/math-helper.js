global.MathHelper = {

  // (πr^2)
  widthToArea(diameter) {
    return Math.round(Math.PI*Math.pow(diameter/2,2));
  }

}
