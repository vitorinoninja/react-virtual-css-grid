import React from 'react'
import units from 'units-css'

class VirtualCSSGrid extends React.Component {

  constructor(props){
    super(props)

    // the renderGridItem function is required
    if(!props.renderGridItem) throw new Error("A CSSGrid item renderer is required (renderGridItem prop)")
    // the renderGridItem function is required
    if(!props.nItems) throw new Error("The total ammount of items to render is required (nItems prop)")

    // the cointainer style
    let style = {
      overflow: 'auto',
      // totally arbitrary first height value
      height:'100px',
      ...props.style,
    }

    //  the gridStyle
    let finalGridStyle = {
      display: "grid",
      overflow: "hidden",
      ...props.gridStyle
    }

    // other defaults and props overrides
    let {
      //  how many items to render
      nItems = 0,
      //  how many columns
      nColumns = 5,
      // each column line width (any unit)
      columnWidth = "1fr",  // not used of gridTemplateColumns is defined
      // each row line height in pixels
      rowHeight = 100,
      // required renderGridItem function
      // receives: {absolutePosition, columnPosition, rowPosition}
      renderGridItem,
      //  just removing the gridStyle property as well
      gridStyle,
      // remaining known props for the container div
      ...divProps
    } = props

    let {
      rowsGap,
      columnsGap
    } = this.resolveGap(finalGridStyle.gridGap)

    this.state = {
      style,
      finalGridStyle,
      nItems,
      nColumns,
      columnWidth,
      rowHeight,
      content:[],
      rowPosition:0,
      renderGridItem,
      divProps,
      rowsGap,
      columnsGap
    }

  }

  // resolving the gap value
  resolveGap(gapCSSString){
    // default gaps (0 pixels)
    let defaultGaps = {
      rowsGap:0,
      columnsGap:0
    }
    if(!gapCSSString) return defaultGaps
    // converting abitrary gap values to pixels
    return {
      // setting the defaults
      ...defaultGaps,
      // calculating the values in pixels even for crazy values
      // "%" support requires the grid dimensions first
      //  it might be useful to ignore broken css gridGap values
      //  instead of this approach... time will tell
      //  value ex: grid-gap = "1em     2px"
      ...gapCSSString.split(/\s+/).reduce((obj, item, index) => {
          // getting current gap (first row, then column, then ignore any extra)
          let gap = units.convert("px", item)
          //  setting both row and column gap to the first value found
          if(index == 0)  return { rowsGap: gap, columnsGap: gap}
          //  setting the column gap to the second value found
          if(index == 1)  return { ...obj, columnsGap: gap }
          //  any other value is ignored
          return obj
        }, {})
      }
  }

  //  receives the scrollTop and offsetHeight
  //  and provides the numbers we need to render
  //  just the necessary items
  //  scrollTop is typically the scroll event target scrollTop value
  //  containerHeight is typically the scroll event target offsetHeight value (the actual box height of it)
  calculateContentPosition = (scrollTop, containerHeight) => {
    //  how many rows are we talking about?
    let nRows             = Math.ceil(this.state.nItems / this.state.nColumns)
    //  calculated height of the grid
    let gridHeight        = nRows * this.state.rowHeight + this.state.rowsGap * (nRows-1)
    //  we might roll just enough to see an extra row
    let nRowsToShow       = Math.ceil(containerHeight / this.state.rowHeight)+1
    //  here we calculate how many items we will render
    let nItensToRender    = nRowsToShow*this.state.nColumns
    //  the abolute position considering an one dimension list/array
    let position          = Math.floor(this.state.nItems * scrollTop / gridHeight) || 0
    //  we must ajust the position to always fill from the first grid cell
    //  even if the scroll position "points" to an item in the middle of a line
    let firstItemToShow   = position - (position % this.state.nColumns)
    //  getting the rowPosition now that we stabished the absolutePosition
    let rowPosition       = Math.floor(firstItemToShow / this.state.nColumns)
    //  ;)
    let content = [...Array(nItensToRender).keys()]
                  .map(i => i+firstItemToShow)
                  .filter(i => i < this.state.nItems)
                  .map((absolutePosition, counter) => {
                    let columnPosition  = absolutePosition % this.state.nColumns
                    let rowPosition     = Math.floor(counter / this.state.nColumns)
                    let gridItem        = this.state.renderGridItem({absolutePosition, columnPosition, rowPosition})
                    let styledGridItem  = {
                      ...gridItem,
                      style:{
                        ...gridItem.style,
                        gridRowStart:rowPosition+1,
                        gridColumnStart:columnPosition+1,
                      }
                    }
                    return styledGridItem
                  })

    // The Grid Style
    let marginTop           = (rowPosition * this.state.rowHeight + this.state.rowsGap * (rowPosition))
    let gridTemplateColumns = this.state.gridTemplateColumns || `repeat(${nRowsToShow}, ${this.state.rowHeight}px)`
    let finalGridStyle = {
        ...this.state.finalGridStyle,
        display:"grid",
        height:`${gridHeight-marginTop}px`,
        gridTemplateColumns:`repeat(${this.state.nColumns}, ${this.state.columnWidth})`,
        gridTemplateRows:`repeat(${nRowsToShow}, ${this.state.rowHeight}px)`,
        overflow:"hidden",
        //gridGap:"10px",
        marginTop
    }

    // sets the state (and that calls the render function again)
    this.setState({
      content,
      scrollTop,
      nRowsToShow,
      rowPosition,
      finalGridStyle
    })
  }

  // handles the React onScroll event
  handleScroll = ({target:{scrollTop, offsetHeight}}) => {
    this.calculateContentPosition(scrollTop, offsetHeight)
  }

  // renders the first time as soon as we can calculate the dimensions
  componentDidMount(){
    this.calculateContentPosition(0, this.container.offsetHeight)
  }

  // the actual react component render method
  render(){
    return(
      <div
        {...this.state.divProps}
        ref={element => this.container = element}
        style={this.state.style}
        onScroll={this.handleScroll} >

          <div style={this.state.finalGridStyle}>
              {this.state.content}
          </div>

      </div>
  )}

}

export default VirtualCSSGrid
