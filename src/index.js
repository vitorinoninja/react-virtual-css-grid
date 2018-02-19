//  this modules default export will be the VirtualCSSGrid component
import VirtualCSSGrid from './virtualCSSGrid.js'
import VirtualCSSGridAuto from './virtualCSSGridAuto.js'

//  resizable is available as a decorator or higher order component
//  it's not clear if the best practice is to give just the decorator
//  or just pass the whole already wrapped VirtualCSSGrid
//  we are using the second aproach here, since its simpler to use
//  ie: import { ResizableVirtualCssGrid } from react-virtual-css-grid
import resizable from './resizable.js'

//   the actual exports
export const ResizableVirtualCssGrid = resizable(VirtualCSSGridAuto)
//export default VirtualCSSGrid
export default VirtualCSSGridAuto
