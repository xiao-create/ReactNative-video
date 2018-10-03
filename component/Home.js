import React, { Component } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
//API
const URL = 'http://api.apiopen.top/todayVideo';

// 计算左侧的外边距，使其居中显示
const {width,height} = Dimensions.get('window');
const cols = 2;
const marginLeft = 8;

const card_width = Number.parseInt((width - (cols+1)*marginLeft) / (cols));
const card_height = 120;
const hMargin = 10;



class Home extends Component {
    static navigationOptions = {
        // title: '今日更新',
        header:null

    };

    constructor(props){
        super(props);
        this.state = {
            dataSource: null,
            isLoaded:false
        };
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData(){
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                let dataList = [];
                for(let i=0; i<data.result.length; i++){
                    if (data.result[i].type !== "textCard"){
                        if (data.result[i].data.content.data.title === ""){
                            data.result[i].data.content.data.title = data.result[i].data.content.data.description;
                        }

                        dataList.push(data.result[i]);
                    }
                }

                console.log(dataList)
                this.setState({
                    dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(dataList),
                    isLoaded:true
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    dataSource: null,
                    isLoaded:false
                })
            })
            .done()
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                {
                    this.state.isLoaded ?
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData)=>this._renderRow(rowData)}
                            contentContainerStyle={styles.listViewStyle}
                        /> :
                        <View style={styles.indicatorStyle}>
                            <ActivityIndicator size='large' color='#398DEE'/>
                        </View>
                }

            </View>
        );
    }
    // 注意TouchableOpacity和内层View容器的样式
    _renderRow(rowData){
        return (
            <TouchableOpacity
                style={styles.wrapStyle}
                activeOpacity={0.5}
                onPress={() => this.pushToVideoDetail(rowData)}
            >

                <View style={styles.innerView}>
                    <Image source={{uri:rowData.data.content.data.cover.feed}} style={styles.imgView} />
                    <Text style={styles.categoryTitle}>{rowData.data.content.data.title ? (rowData.data.content.data.title.length > 18 ? rowData.data.content.data.title.substr(0, 18) + "..." : rowData.data.content.data.title) : ""}</Text>


                </View>
            </TouchableOpacity>
        )
    }


    pushToVideoDetail(data){
        this.props.navigation.navigate('VideoPlayDetail',{
            id: data.id,
            title: data.data.content.data.title,
            playUrl: data.data.content.data.playUrl,
            description: data.data.content.data.description
        })

    }

}


import VideoPlayDetail from './VideoPlayDetail'

const RootStack = createStackNavigator(
    {
        Home: Home,
        VideoPlayDetail: VideoPlayDetail,
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#3496f0',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);


const styles = StyleSheet.create({
    listViewStyle:{
        // 改变主轴的方向
        flexDirection:'row',
        // 多行显示
        flexWrap:'wrap',
        // 侧轴方向
        backgroundColor: '#e7e1ea',
        paddingBottom: 120

    },
    wrapStyle:{
        width: card_width,
        height:card_height+50,
        marginLeft:marginLeft,
        marginTop:hMargin,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    innerView:{
        width: card_width,
        height:card_height+5,
    },
    imgView:{
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width:card_width,
        height:card_height
    },
    categoryTitle:{
        textAlign:'center',
        padding: 5,
        width: card_width,
        color: '#2c2c2c',
    }
});

export default class App extends React.Component {
    render() {
        return(
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="#3496f0"/>
                <RootStack />
            </View>

        )
            ;
    }
}