import React, { useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  InteractionManager,
} from 'react-native';

const NestedView = ({ level, maxLevel }: { level: number; maxLevel: number }) => {
  const renderStartTime = useRef(Date.now());
  const mountTime = useRef(0);

  // 相当于 onCreate
  console.log(`[生命周期] Level ${level} 开始创建: ${renderStartTime.current}ms`);

  // 相当于 onStart
  const jsxStartTime = Date.now();
  console.log(`[生命周期] Level ${level} 开始渲染 JSX: ${jsxStartTime}ms`);

  // 相当于 onResume
  useLayoutEffect(() => {
    mountTime.current = Date.now();
    const renderTime = mountTime.current - renderStartTime.current;
    console.log(`[生命周期] Level ${level} 挂载完成: ${mountTime.current}ms`);
    console.log(`[性能监控] Level ${level} 总渲染耗时: ${renderTime}ms`);
  }, [level]);

  if (level > maxLevel) return null;

  return (
    <View style={[styles.nestedContainer, { backgroundColor: `hsl(${level * 30}, 70%, 80%)` }]}>
      <Text style={styles.levelText}>Level {level}</Text>
      <View style={styles.contentContainer}>
        <NestedView level={level + 1} maxLevel={maxLevel} />
        <NestedView level={level + 1} maxLevel={maxLevel} />
      </View>
    </View>
  );
};

const App = () => {
  const [selectedPlatform, setSelectedPlatform] = React.useState<'android' | 'tvos'>(
    Platform.OS === 'android' ? 'android' : 'tvos'
  );
  const renderStartTime = useRef(Date.now());
  const mountTime = useRef(0);

  // 相当于 onCreate
  console.log(`[生命周期] App 开始创建: ${renderStartTime.current}ms`);

  // 相当于 onStart
  const jsxStartTime = Date.now();
  console.log(`[生命周期] App 开始渲染 JSX: ${jsxStartTime}ms`);

  // 相当于 onResume
  useLayoutEffect(() => {
    mountTime.current = Date.now();
    const renderTime = mountTime.current - renderStartTime.current;
    console.log(`[生命周期] App 挂载完成: ${mountTime.current}ms`);
    console.log(`[性能监控] App 总渲染耗时: ${renderTime}ms`);

    // 相当于界面完全加载
    InteractionManager.runAfterInteractions(() => {
      const completeRenderTime = Date.now() - renderStartTime.current;
      console.log(`[生命周期] App 完全加载完成: ${Date.now()}ms`);
      console.log(`[性能监控] 页面完全渲染耗时: ${completeRenderTime}ms`);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complex View Tree Demo</Text>
        <Text style={styles.platformText}>Platform: {selectedPlatform}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        onScrollBeginDrag={() => {
          console.time('scroll-time');
        }}
        onScrollEndDrag={() => {
          console.timeEnd('scroll-time');
        }}
      >
        <NestedView level={1} maxLevel={10} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, selectedPlatform === 'android' && styles.selectedButton]}
          onPress={() => {
            const startTime = Date.now();
            setSelectedPlatform('android');
            requestAnimationFrame(() => {
              console.log('Android TV 切换耗时:', Date.now() - startTime, 'ms');
            });
          }}>
          <Text style={styles.buttonText}>Android TV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedPlatform === 'tvos' && styles.selectedButton]}
          onPress={() => {
            const startTime = Date.now();
            setSelectedPlatform('tvos');
            requestAnimationFrame(() => {
              console.log('tvOS 切换耗时:', Date.now() - startTime, 'ms');
            });
          }}>
          <Text style={styles.buttonText}>tvOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  platformText: {
    fontSize: 16,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  nestedContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;