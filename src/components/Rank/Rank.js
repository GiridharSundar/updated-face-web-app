import React from 'react';

class Rank extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      emoji: ''
    }
  }

  getEmoji = (entries) => {
    fetch(`https://khzy78av26.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
      .then(response => response.json())
      .then(data => {
        this.setState({emoji: data.input})
      })
      .catch(console.log)
  }

  componentDidMount(){
    this.getEmoji(this.props.entries);
  }

  componentDidUpdate(prevProps,prevStae){
    if(prevProps.entries !== this.props.entries){
      this.getEmoji(this.props.entries);
    }
  }

  render(){
    const {name,entries} = this.props;
    return (
      <div>
        <div className='white f3'>
          {`${name}, your current entry count is...`}
        </div>
        <div className='white f1'>
          {entries}
        </div>
        <div className='white f3'>
          {`Rank is :${this.state.emoji} `}
        </div>
      </div>
    );
  }
}

export default Rank;