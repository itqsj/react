import React, { lazy, Suspense, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const LazyDemo = lazy(() => import('@/components/demo/LazyDemo')) // 使用import语法配合react的Lazy动态引入资源
import Class from '@/components/demo/Class'
import { Demo1, Demo2 } from '@/components'
// prefetch
const PreFetchDemo = lazy(() => import(
  /* webpackChunkName: "PreFetchDemo" */
  /*webpackPrefetch: true*/
  '@/components/demo/PreFetchDemo'
))
// preload
const PreloadDemo = lazy(() => import(
  /* webpackChunkName: "PreloadDemo" */
  /*webpackPreload: true*/
  '@/components/demo/PreloadDemo'
 ))

import '@/app.less'

function Demo() {
  const [show, setShow] = useState(false)
  const [search] = useSearchParams()
  console.log(search.get('aa'));
  

  // 点击事件中动态引入css, 设置show为true
  const onClick = () => {
    import('@/app.css')
    setShow(true)
  }
  return <div>
    <h2>webpack5-react-ts</h2>
    <Class></Class>
    <div className='smallImg'></div>
    <div className='bigImg'></div>
    <Demo1></Demo1>
    <h2 onClick={onClick}>展示</h2>
    {/* show为true时加载LazyDemo组件 */}
    { show && <Suspense fallback={null}><LazyDemo /></Suspense> }
    { show && (
        <div>
          <Suspense fallback={null}><PreloadDemo /></Suspense>
          <Suspense fallback={null}><PreFetchDemo /></Suspense>
        </div>
      ) }
  </div>
}
export default Demo