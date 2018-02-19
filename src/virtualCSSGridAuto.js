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
      nColumns = 1,
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
    //  notice the gridTemplateColumns can be defined using nColumns + columnWidth
    //  but will be overrided by gridTemplateColumns if defined
    let gridStyle = {
      display: "grid",
      overflow: "hidden",
      gridTemplateColumns:`repeat(${nColumns}, ${columnWidth})`,
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
      columnsGap,
      addedArea:0
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

  renderNext = (position = 0, virtualContent = [], addedWidth = 0, averageRowHeight = 0) => {

    //  we will keep adding items until we have the first row filled
    //  the calculated CSS will allow us to predict the rest of the visible grid

    //  adding the next gridItem
    virtualContent.push(this.state.renderGridItem({
      position,
      columnPosition:position - this.state.firstItemToShow,
      rowPosition:0,
      scrollRatio:this.state.scrollRatio
    }))
    //console.log(position % this.state.nColumns, this.state.nColumns)
    //  commiting the changes to render
    this.setState({
      //  content so far
      content:virtualContent,
      //  nColumns so far
      nColumns:position - this.state.firstItemToShow
    }, () => {
      //  uppon rendering the last inserted item,
      //  calculate if we filled the first row properly
      this.forceUpdate(() => {

        //  how many items currently on the grid
        let gridNChildren = this.grid.children.length

        //  once we added at least one, get the width of the last item added
        if(gridNChildren > 0){
          let lastChild = this.grid.children[gridNChildren-1]
          //  adding to the total width of all children so far
          addedWidth += lastChild.offsetWidth+this.state.columnsGap
          //  averaging the how height to predict how many we may have
          averageRowHeight = gridNChildren > 1 ? (averageRowHeight + lastChild.offsetHeight) / 2 : lastChild.offsetHeight
        }
        //  until we filled a rows visible space, add anote gridItem
        if(addedWidth < this.container.offsetWidth ){
          this.renderNext(position+1, virtualContent, addedWidth, averageRowHeight)
        }else {
          //  once the first row is filled, calculate how many items
          //  will take to fill the grid and populate before the next render
          //  number of columns to fill the first row
          let nColumns = gridNChildren-1
          //  estimated number of rows to fill a column (minus the first)
          let nRows = Math.floor(this.container.offsetHeight / (averageRowHeight+this.state.rowsGap)) -1

          //  calling the actual method that populates the rest of the grid
          //  nColumns will be decreased by 1, since we needed one extra item to get the row break
          this.renderRemainingSpace(position+1, virtualContent, nColumns, nRows, averageRowHeight)
        }
      })
    })
  }

  //  fills the remaining grid space (after the first row)
  //  nRows is the number of rows to fill the remaining space (total - 1)
  //  virtualContent is the list of the rendered gridItems so far
  //  position is the next gridItem position
  //  nColumns is the calculated number os columns per row
  //  averageRowHeight is the calculated height of the first row
  renderRemainingSpace = (position, virtualContent, nColumns, nRowsToShow, averageRowHeight) =>
  {
    //  how many items we will render
    let nItems          = nColumns * nRowsToShow
    let current         = 1
    let { scrollRatio } = this.state

    //  calculating the grid style required numbers
    let nRows           = Math.ceil(this.state.nItems / nColumns)
    let gridHeight      = nRows * averageRowHeight + this.state.rowsGap * (nRows-1)
    let rowPosition     = Math.floor(position / nColumns)-1
    let marginTop       = (rowPosition * averageRowHeight + this.state.rowsGap * (rowPosition))

    while(current < nItems){
      let columnPosition  = current % nColumns
      let rowPosition     = Math.floor(current / nColumns) + 1
      virtualContent.push(this.state.renderGridItem({
        position,
        columnPosition,
        rowPosition,
        scrollRatio
      }))
      position++
      current++
    }

    // The Grid Style
    let gridStyle = {
        ...this.state.gridStyle,
        height:`${gridHeight-marginTop}px`,
        gridTemplateRows:`repeat(${nRowsToShow+1}, ${averageRowHeight}px)`,
        marginTop
    }

    this.setState({
      content:virtualContent,
      gridStyle
    })
  }

  //  receives the scrollTop and offsetHeight
  //  and provides the numbers we need to render
  //  just the necessary items
  //  scrollTop is typically the scroll event target scrollTop value
  //  containerHeight is typically the scroll event target offsetHeight value (the actual box height of it)
  calculateContentPosition = (scrollTop, containerScrollHeight, containerHeight) => {

    //  ;)
    let content = []
    // The Grid Style
    let gridStyle = {
        ...this.state.gridStyle,
        display:"grid",
        overflow:"hidden",
    }

    //  defining our current scrollRatio
    let scrollRatio       =  scrollTop / ( containerScrollHeight - containerHeight )
    //  the position of the gridItem to render considering an one dimension list/array
    let position          = Math.floor(this.state.nItems * scrollTop / containerScrollHeight) || 0
    //  considering the number of columns, gets the position of the first item to show relative to the scroll
    let firstItemToShow   = position - (position % this.state.nColumns)
    console.log(firstItemToShow, this.state.nColumns)
    //  reseting nColumns to be recalculated
    let nColumns          = 1
    // sets the state (and that calls the render function again)
    this.setState({
      content,
      gridStyle,
      scrollTop,
      position,
      firstItemToShow,
      nColumns
    })

    this.renderNext(firstItemToShow)

  }

  // handles the React onScroll container event
  handleScroll = (e) => {
    if(e.target != this.container) return
    let {target:{scrollTop, scrollHeight, offsetHeight}} = e
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
