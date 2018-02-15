//  Higher order decorator component to allow resize detection
//  I'm using this great module: https://github.com/wnr/element-resize-detector
//  choosing the best way to handle element resize is no trivial task,
//  the goal here is to get the minimal footprint possible (pcu, bundle size...)
//  and keep the resizing optional as a decorator for our component
import resizeDetector from 'element-resize-detector'
import React from 'react'

export default (Component) => {
  return class extends React.Component {
    constructor(props){
      super(props)
      //  using scroll resize detection strategy...
      //  it is currently (2018-2-15) deprecating the other option
      this.resizeDetector = resizeDetector({ strategy: "scroll" })
    }

    //  container is the ref defined by our wrapped VirtualCSSGrid
    componentDidMount() {
      this.resizeDetector.listenTo(this.virtualCSSGrid.container, this.handleResize)
    }

    componentWillUnmount() {
      this.resizeDetector.removeAllListeners(this.virtualCSSGrid.container)
    }

    //  handling the container resize
    handleResize = (element) => {

      //  old scroll ratio
      let oldScrollRatio        = this.virtualCSSGrid.state.scrollRatio

      //  new scroll data
      let containerScrollHeight = element.scrollHeight
      let containerHeight       = element.offsetHeight
      let scrollTop             = oldScrollRatio * ( containerScrollHeight - containerHeight )

      //  keeping the scroll position as close to the old one as possible
      element.scrollTop         = scrollTop

      //  calculating the new content position (and rendering)
      this.virtualCSSGrid.calculateContentPosition(scrollTop, containerScrollHeight, containerHeight)
    }

    render(){
      return <Component ref={e => this.virtualCSSGrid = e} {...this.props} {...this.state} />
    }
  }
}
