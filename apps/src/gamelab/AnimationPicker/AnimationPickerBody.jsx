/** Body of the animation picker dialog */
'use strict';

var AnimationPickerListItem = require('./AnimationPickerListItem.jsx');
var AnimationPickerSearchBar = require('./AnimationPickerSearchBar.jsx');
var gamelabMsg = require('../locale');
var Radium = require('radium');
var ScrollableList = require('../AnimationTab/ScrollableList.jsx');
var styles = require('./styles');

var AnimationPickerBody = React.createClass({
  propTypes: {
    onUploadClick: React.PropTypes.func.isRequired
  },

  render: function () {
    return <div>
      <h1 style={styles.title}>{gamelabMsg.animationPicker_title()}</h1>
      <AnimationPickerSearchBar />
      <ScrollableList style={{maxHeight: 400}}> {/* TODO: Is this maxHeight appropriate? */}
        <AnimationPickerListItem
            label={gamelabMsg.animationPicker_drawYourOwn()}
            icon="pencil" />
        <AnimationPickerListItem
            label={gamelabMsg.animationPicker_uploadImage()}
            icon="upload"
            onClick={this.props.onUploadClick} />
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/asterisk_circle.png'}
            sourceWidth={396}
            sourceHeight={378}
            frameWidth={132}
            frameHeight={126}
            frameCount={9}
            frameRate={15}
            label="asterisk_circle (9)"/>
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/asterisk_explode.png'}
            sourceWidth={684}
            sourceHeight={474}
            frameWidth={171}
            frameHeight={158}
            frameCount={11}
            frameRate={15}
            label="asterisk_explode (11)"/>
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/asterisk_normal.png'}
            sourceWidth={396}
            sourceHeight={126}
            frameWidth={132}
            frameHeight={126}
            frameCount={3}
            frameRate={15}
            label="asterisk_normal (3)"/>
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/asterisk_stretching.png'}
            sourceWidth={432}
            sourceHeight={432}
            frameWidth={144}
            frameHeight={144}
            frameCount={8}
            frameRate={15}
            label="asterisk_stretching (8)"/>
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/ghost_standing.png'}
            sourceWidth={504}
            sourceHeight={158}
            frameWidth={72}
            frameHeight={158}
            frameCount={7}
            frameRate={15}
            label="ghost_standing (7)"/>
        <AnimationPickerListItem
            sourceUrl={'/blockly/media/gamelab/library/platform.png'}
            sourceWidth={200}
            sourceHeight={219}
            frameWidth={200}
            frameHeight={73}
            frameCount={3}
            frameRate={15}
            label="platform (3)"/>
      </ScrollableList>
    </div>;
  }
});
module.exports = Radium(AnimationPickerBody);
