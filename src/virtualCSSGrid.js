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

  renderNext = (position = 0, virtualContent = [], averageRowHeight = 0) => {

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
      nColumns:this.grid.children.length
    }, () => {
      //  uppon rendering the last inserted item,
      //  calculate if we filled the first row properly
      this.forceUpdate( () => {

        //  how many items currently on the grid
        let gridNChildren = this.grid.children.length
        let lastChild     = this.grid.children[gridNChildren-1]

        //  adding to the total width of all children so far
        //  averaging the how height to predict how many we may have
        averageRowHeight  = gridNChildren > 1 ? (averageRowHeight + lastChild.offsetHeight) / 2 : lastChild.offsetHeight
        //  check if padding is also necessary
        let firstRowOffSetTop = this.state.gridStyle.marginTop || 0
        //  until we fill the fisrt row, keep adding gridItems
        //  PS: looks like this is not as consistent as expected...
        if(lastChild.offsetTop === firstRowOffSetTop ){
          this.renderNext(position+1, virtualContent, averageRowHeight)
        }else {
          //  Ensuring the nColumns (giving a little extra time to render)
          let nColumns = gridNChildren-1 ? gridNChildren-1 : 1
          //  estimated number of rows to fill a column (minus the first)
          let nRowsToShow = Math.ceil(this.container.offsetHeight / (averageRowHeight+this.state.rowsGap))
          //  calling the actual method that populates the rest of the grid
          //  nColumns will be decreased by 1, since we needed one extra item to get the row break
          this.renderRemainingSpace(position+1, virtualContent, nColumns, nRowsToShow, averageRowHeight)
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
    let nRemainingItems   = nColumns * nRowsToShow
    let current           = 1
    let { scrollRatio }   = this.state

    //  how many prerendered rows we got before this method
    let nPrerenderedRows  = Math.floor(virtualContent.length / nColumns)

    //  calculating the grid style required numbers
    let nRows             = Math.ceil(this.state.nItems / nColumns)
    let gridHeight        = nRows * averageRowHeight + this.state.rowsGap * (nRows-1)
    let rowPosition       = Math.floor(position / nColumns)-nPrerenderedRows
    let marginTop         = rowPosition * averageRowHeight + this.state.rowsGap * rowPosition

    while(current <= nRemainingItems && position < this.state.nItems){
      let columnPosition  = current % nColumns
      let rowPosition     = Math.floor(current / nColumns)+1
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
      gridStyle,
      nColumns,
      averageRowHeight
    })

  }


  //  calculates the offsetTop of the first gridItem then
  //  verifies how many subsequent gridItems have the same value
  //  thefore, they are on the same row and we have our nColumns
  nColumnsFromRenderedItems = () =>{
    let firstOffsetTop  = this.grid.children[0].offsetTop
    let nColumns = 0
    Array.from(this.grid.children).some(child => {
                  if(child.offsetTop === firstOffsetTop){
                    nColumns++
                    return false
                  }
                  return true
                })
    return nColumns
  }


  //  receives the scrollTop and offsetHeight
  //  and provides the numbers we need to render
  //  just the necessary items
  //  scrollTop is typically the scroll event target scrollTop value
  //  containerHeight is typically the scroll event target offsetHeight value (the actual box height of it)
  calculateContentPosition = (scrollTop, containerScrollHeight, containerHeight) => {

    //  defining our current scrollRatio
    let scrollRatio       =  scrollTop / ( containerScrollHeight - containerHeight )
    //  the position of the gridItem to render considering an one dimension list/array
    let position          = Math.floor(this.state.nItems * scrollTop / containerScrollHeight) || 0
    //  considering the number of columns, gets the position of the first item to show relative to the scroll
    let firstItemToShow   = position - (position % this.state.nColumns)

    //  initial nColumns state
    let { nColumns }      = this.state

    //  the new content
    let content           = []

    //  at this point there are two possible jobs to perform:
    //  render the first row to calculate the nColumns and averageRowHeight
    //  or check if any changed state does not require to calculate that again
    //  and proceed to fill the grid using the last calculated values
    //  first check if we have previosly calculated nColumns and averageRowHeight
    if(this.state.averageRowHeight){
        //  since we already know the nColumns and averageRowHeight
        //  just fill the available space as quickly as possible
        let nRowsToShow = 1+Math.ceil((containerHeight-this.state.averageRowHeight) / (this.state.averageRowHeight+this.state.rowsGap))
        this.renderRemainingSpace(firstItemToShow, [], nColumns, nRowsToShow, this.state.averageRowHeight)
        return
    }

    // sets the state (and that calls the render function again)
    this.setState({
      content,
      scrollTop,
      position,
      firstItemToShow,
      nColumns
    })

    //  go render the first item of the first row
    this.renderNext(firstItemToShow)


    //  Since reading the offsetTop property wans't as consistent as we need
    //  (an item on the second row might have offsetTop != firstRowOffSetTop)
    //  we might need to recalculate just to be sure the nColumns captured
    //  matches the value rendered after the css is finally parsed
    //  here im giving 1 milissend just after everything is ready just to be sure
    setTimeout(() =>{
      let nColumnsCheck = this.nColumnsFromRenderedItems()
      if(nColumnsCheck != this.state.nColumns){
        this.setState({
          nColumns:nColumnsCheck
        }, () => {
          this.calculateContentPosition(scrollTop, containerScrollHeight, containerHeight)
        })
      }
    },1)

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
