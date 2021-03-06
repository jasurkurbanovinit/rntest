import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Modal, Alert, TouchableHighlight, ActivityIndicator, Image, StyleSheet } from 'react-native'
import axios from 'axios'
import { SHADOW, WHITE, BLACK, TRANSPARENT, PRIMARY } from '../../constants'
import { Header } from '../../components'
import { SwipeListView } from 'react-native-swipe-list-view'

const Todos = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [page, setPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)

  const {
    authorView,
    authorStyle,
    flatListViewStyle,
    modalContainer,
    modalItem,
    whiteColor,
    footer,
    separator,
    img,
  } = styles

  useEffect(() => {
    fetchData()
    setModalVisible(true)
  }, [fetchData, setModalVisible])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await axios(`https://picsum.photos/v2/list?page=${page}&limit=10`)
    setLoading(false)
    setDataSource(page === 1 ? result.data : [...dataSource, ...result.data])
  }, [page, dataSource])

  const renderSeparator = () => {
    return <View style={separator} />
  }

  const renderFooter = () => {
    if (!loading) return null

    return (
      <View style={footer}>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  const handleLoadMore = () => {
    setPage(page + 1)
    fetchData()
  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey)
    const newData = [...dataSource]
    const prevIndex = dataSource.findIndex((item) => item.id === rowKey)
    newData.splice(prevIndex, 1)
    setDataSource(newData)
  }

  const renderItem = ({ item }) => {
    const authorArray = item.author.split(' ')
    return (
      <TouchableHighlight>
        <View style={flatListViewStyle}>
          <Image source={{ uri: item.download_url }} style={img} />
          <View style={authorView}>
            <Text style={authorStyle}>{authorArray[0]}</Text>
            <Text>{authorArray[1]}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  const HiddenItemsWithActions = (props) => {
    const { onDelete } = props
    return (
      <View style={styles.rowBack}>
        <TouchableHighlight style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDelete}>
          <Text style={whiteColor}>Delete</Text>
        </TouchableHighlight>
      </View>
    )
  }
  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemsWithActions
        data={data}
        rowMap={rowMap}
        onClose={() => closeRow(rowMap, data.item.id)}
        onDelete={() => deleteRow(rowMap, data.item.id)}
      />
    )
  }

  return (
    <>
      <Header nav={navigation} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Status', 'Modal has been closed.')
        }}
      >
        <View style={modalContainer}>
          <View style={modalItem}>
            <SwipeListView
              data={dataSource}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              ItemSeparatorComponent={renderSeparator}
              ListFooterComponent={renderFooter}
              onEndReached={handleLoadMore}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0}
              leftOpenValue={75}
              rightOpenValue={-75}
              disableRightSwipe
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  flatListViewStyle: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    padding: 25,
  },
  authorView: { marginLeft: 10 },
  authorStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  separator: {
    height: 3,
    width: '100%',
    backgroundColor: WHITE,
    marginLeft: '14%',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: WHITE,
  },
  img: { width: 60, height: 60, borderRadius: 60 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TRANSPARENT,
  },
  modalItem: {
    width: 300,
    height: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowFront: {
    backgroundColor: WHITE,
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    paddingRight: 15,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    height: 60,
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    height: 80,
    right: 0,
    borderRadius: 10,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: SHADOW,
  },
  details: {
    fontSize: 12,
    color: SHADOW,
  },
  whiteColor: { color: 'white' },
})

export { Todos }
