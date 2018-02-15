import React from 'react'
import units from 'units-css'

class VirtualCSSGrid extends React.Component {

  constructor(props){
    super(props)

    // the renderGridItem function is required
    if(!props.renderGridItem) throw new Error("A CSSGrid item renderer is required (renderGridItem prop)")
    // the renderGridItem function is required
    if(!props.nItems) throw new Error("The total ammount of items to render is required (nItems prop)")

    // other defaults and props overrides
    let {
      //  how many items to render
      nItems = 0,
      //  how many columns
      nColumns = 5,
      // each column line width (any unit)
      columnWidth = "1fr",  // not used if gridTemplateColumns is defined
      // each row line height in pixels
      rowHeight = 100,
      // required renderGridItem function
      // receives: {absolutePosition, columnPosition, rowPosition}
      renderGridItem,
      //  renaming the original gridStyle prop
      gridStyle:gridStyleFromProps,
      //  renaming the original style prop
      style:styleFromProps,
      // remaining known props for the container div
      ...divProps
    } = props

    // the cointainer style
    let style = {
      overflow: 'auto',
      // totally arbitrary first height value
      height:'100px',
      ...styleFromProps,
    }

    //  the gridStyle
    let gridStyle = {
      display: "grid",
      overflow: "hidden",
      ...gridStyleFromProps
    }

    // resolving the gap values
    let {
      rowsGap,
      columnsGap
    } = this.resolveGap(gridStyle.gridGap)

    this.state = {
      style,
      gridStyle,
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
      //  value ex: grid-gap = "5px 2px"
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
  calculateContentPosition = (scrollTop, containerScrollHeight, containerHeight) => {
    //  the real nColumns depends of the grid`s css and dimension
    let nColumns = 0
    //  support for the "auto-fill" cssGrid feature considering
    //  the DOM Engine is filling as much content as it can in one row
    if(/repeat\(\s*auto\-fill/.test(this.grid.style.gridTemplateColumns)){
      //  maximum grid width that can be filled per row
      let maximunWidth = this.grid.offsetWidth
      //  checking how many gridItems are filling a row
      //  and using this as basis for our nColumns
      Array.from(this.grid.children).some(item => {
        //  if the next gridItem need more space then available, nColumns is defined
        if( (maximunWidth -= item.offsetWidth) < 0 ) return true
        //  otherwise we can add more columns
        nColumns++
        return false
      })
    }else{
      //  if the content isn't filling the ammount of columns, we might use
      //  this super fast "hack"s to calculate it before the next render
      //  we start by getting columns specified outside css functions
      //  ie: "[linename1] 100px [linename2] repeat(auto-fit, [linename3 linename4] 300px) 100px"
      //  100px and 100px are 2 columns specified outside css functions
      let columnsOutsideFunctions =  this.grid.style.gridTemplateColumns
                                      .replace(/\S*\(.*?\)|\[.*?\]/g, "")
                                      .trim()
                                      .split(/\s+/)
      //  if no auto-fitting is specified, use the columnsOutsideFunctions length
      nColumns = columnsOutsideFunctions.length
      //  otherwise, calculate how many auto fitted gridItems there will be
      if(this.grid.style.gridTemplateColumns.indexOf("auto-fit") !== -1){
        //  if the ammout of columns is generated using the gridItems size
        //  check how many are necessary to fill one row and use that
        //  as base to calculate the rest of the grid
        //  when auto-fits are present, we can't currently (2018-02-10) use it
        //  with relative units, like fr or %. It must be absolute like px.
        //  so let's calculate how much space the columns outside functions use
        //  to stabilish how much auto-fit room we got remaining
        //  little neat trick starting the reduce at "rowsGap * -1" allows us to
        //  add the rowGap for every new auto fitted item, even if its the first column
        let columnsOutsideFunctionsWidth = columnsOutsideFunctions.reduce( (width, column) => {
                                                                      return width + units.convert("px", column) + this.state.rowsGap
                                                                    }, this.state.rowsGap*-1)
        //  grabbing the auto-fit necessary width per repeat item
        //  ie: repeat(auto-fit, 100px) = 100px necessary per new item (plus grid gap)
        let autoFitSize = this.state.rowsGap+units.convert("px", this.grid.style.gridTemplateColumns.match(/\(.*auto-fit.*?(\d+\w+).*\)/)[1])
        //  finally stabilishing how many auto-fit gridItems we are rendering per column
        let nAutoFittedColumns = Math.floor((this.grid.offsetWidth - columnsOutsideFunctionsWidth) / autoFitSize)
        //  nColumns can be finally calculated sums autofitted and regular gridItems
        nColumns = nAutoFittedColumns + nColumns
      }
    }


    // if by any means we still got 0 nColumns, use the initial state value
    nColumns || (nColumns = this.state.nColumns)

    //  how many rows are we talking about?
    let nRows             = Math.ceil(this.state.nItems / nColumns)
    //  calculated height of the grid
    let gridHeight        = nRows * this.state.rowHeight + this.state.rowsGap * (nRows-1)
    //  we might roll just enough to see an extra row
    let nRowsToShow       = Math.ceil(containerHeight / this.state.rowHeight)+1
    //  here we calculate how many items we will render
    let nItensToRender    = nRowsToShow*nColumns
    //  the abolute position considering an one dimension list/array
    let nItemsPosition    = Math.floor(this.state.nItems * scrollTop / gridHeight) || 0
    //  we must ajust the position to always fill from the first grid cell
    //  even if the scroll position "points" to an item in the middle of a line
    let firstItemToShow   = nItemsPosition - (nItemsPosition % nColumns)
    //  getting the rowPosition now that we stabished the absolutePosition
    let rowPosition       = Math.floor(firstItemToShow / nColumns)
    //  defining our current scrollRatio
    let scrollRatio       =  scrollTop / ( containerScrollHeight - containerHeight )

    //  ;)
    let content = [...Array(nItensToRender).keys()]
                  .map(i => i+firstItemToShow)
                  .filter(i => i < this.state.nItems)
                  .map((position, counter) => {
                    let columnPosition  = position % nColumns
                    let rowPosition     = Math.floor(counter / nColumns)
                    let gridItem        = this.state.renderGridItem({position, columnPosition, rowPosition, scrollRatio})
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
    let gridTemplateColumns = this.state.gridStyle.gridTemplateColumns || `repeat(${nColumns}, ${this.state.columnWidth})`
    let gridStyle = {
        ...this.state.gridStyle,
        display:"grid",
        height:`${gridHeight-marginTop}px`,
        gridTemplateColumns,
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
      gridStyle,
      nColumns
    })
  }

  // handles the React onScroll event
  handleScroll = ({target:{scrollTop, scrollHeight, offsetHeight}}) => {
    this.calculateContentPosition(scrollTop, scrollHeight, offsetHeight)
  }

  // renders the first time as soon as we can calculate the dimensions
  componentDidMount(){
    this.calculateContentPosition(0, this.container.scrollHeight, this.container.offsetHeight)
  }

  // the actual react component render method
  render(){
    return(
      <div
        {...this.state.divProps}
        ref={element => this.container = element}
        style={this.state.style}
        onScroll={this.handleScroll} >

          <div
            ref={grid => this.grid = grid}
            style={this.state.gridStyle} >
            {this.state.content}
          </div>

      </div>
  )}

}

export default VirtualCSSGrid
