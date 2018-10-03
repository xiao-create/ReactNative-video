import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'; // 1.0.0-beta.27

import HomeScreen from './component/Home'
import Category from './component/Category'
import Live from './component/Live'
import Dance from './component/Dance'
import Photos from './component/Photos'
import movement from './component/movement'

export default createMaterialTopTabNavigator(
    {
        直播: Live ,
        推荐: HomeScreen ,
        分区: Category,
        舞蹈: Dance,
        相册: Photos,
        动态: movement,
    },
    {
        initialRouteName: '推荐',
        tabBarPosition: 'top',
        animationEnabled: true,
        lazy: true,
        optimizationsEnabled: true,
    }
);