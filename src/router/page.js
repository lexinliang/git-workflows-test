const transDemo = () => import('../page/transDemo')
const bnbDemo = () => import('../page/bnbDemo/index.vue')

let routeArr = [
  {
    path: '/transDemo',
    name: 'transDemo',
    component: transDemo
  },
  {
    path: '/bnbDemo',
    name: 'bnbDemo',
    component: bnbDemo
  }
]
export default routeArr
