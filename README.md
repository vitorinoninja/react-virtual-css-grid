
# react-virtual-css-grid

**Extremely fast and lightweight virtual CSSGrid(also used as list) for React**

This project is currently "super alpha" with basic support and is subject to all kinds of changes. Keep that in mind and the version you are using "hard coded".

## Install
#### yarn
```shell
yarn add react-virtual-css-grid
```
#### npm
```shell
npm i react-virtual-css-grid
```
## Importing on your project
ES6
```javascript
import VirtualCSSGrid from 'react-virtual-css-grid'
```
OldSchool
```javascript
var VirtualCSSGrid = require('react-virtual-css-grid');
```

## Usage

It can be as simple as:
```javascript
<VirtualCSSGrid nItems={100} renderGridItem={this.renderGridItem} />
```

But some default values are recommended as shown in this basic example
```javascript
import React from 'react';
import VirtualCSSGrid from 'react-virtual-css-grid'

class App extends React.Component {

    //  considering we will be adding lots of rows,
    //  lets set some default height for the container style
    getCointainerStyle(){
      return {
        height:"100vh",
        textAlign:"center"
      }
    }

    // 	sample grid item renderer
    //
    // 	this will just get the item position and put inside a div
    // 	you might want to use this to get actual data
    //	from a list and print neat components
    //
    //	considering you provided a given nItems value
    //	position is the item corresponding to certain scroll
    //	columnPosition is the position of that iten's column on the grid
    //	rowPosition is the position of that iten's row on the grid
    //  scrollRatio is the current scroll position from 0 to 1
    renderGridItem({position, columnPosition, rowPosition, scrollRatio}){
      //  defining some styles for the grid item
      //  only gridRowStart and gridColumnStart will be overwritten
      let style = {
        alignSelf:"center",
        background:`#d0d0d0`,
        height:"100%",
        alignContent:"center",
        display:"grid"
      }
      //	returning one div as gridItem
      return (
        <div style={style} key={position}>
          {position}
        </div>
      )
    }

  render() {
    return (
      <div>
        <VirtualCSSGrid
          //  the function that renders each gridItem
          //  required
          renderGridItem={this.renderGridItem}
          //  how many itens we have on our grid
          //  required
          nItems={100}
          //  some optional fields:
          //  the container style (recommended)
          style={this.getCointainerStyle()}
          //  the grid style (goes as a div and child of the container)
          //  also recommended
          gridStyle={{gridGap:"10px 5px"}}
          //  how many columns we want on our grid
          //  recommended (nColumns={1} makes the grid a list)
          nColumns={5}
        />
      </div>
    );
  }
}

export default App;

```

You can try to use this as your "App" component for your create-react-app starter kit to check the results and tweak parameters.
