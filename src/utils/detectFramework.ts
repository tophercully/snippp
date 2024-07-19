import { categories } from "./categories";

type CategoryKey = keyof typeof categories;

export const detectFrameworks = (code: string): CategoryKey[] => {
  const detectedFrameworks: CategoryKey[] = [];

  // React and React Native
  if (
    /import\s+(?:React|{.*?})\s+from\s+['"]react['"]/.test(code) ||
    /<[A-Z][A-Za-z]*\s+/.test(code) ||
    /className=/.test(code) ||
    /use(?:State|Effect|Context|Reducer|Callback|Memo|Ref)\s*\(/.test(code) ||
    /React\.(?:createElement|cloneElement|createRef|Fragment)/.test(code) ||
    /ReactDOM\.(?:render|hydrate|createPortal)/.test(code) ||
    /(?:componentDidMount|componentDidUpdate|componentWillUnmount)/.test(
      code,
    ) ||
    /(?:getDerivedStateFromProps|getSnapshotBeforeUpdate)/.test(code) ||
    /shouldComponentUpdate/.test(code) ||
    /(?:mapStateToProps|mapDispatchToProps)/.test(code) ||
    /<(?:Fragment|Suspense|ErrorBoundary)>/.test(code)
  ) {
    detectedFrameworks.push("reactjs");
  }

  if (
    /import\s+.*?\s+from\s+['"]react-native['"]/.test(code) ||
    /<(?:View|Text|Image|ScrollView|FlatList|TouchableOpacity|TextInput)\s/.test(
      code,
    ) ||
    /StyleSheet\.create\(/.test(code) ||
    /(?:Animated|Easing|LayoutAnimation)/.test(code) ||
    /(?:AppRegistry|Platform|Dimensions)/.test(code) ||
    /(?:AsyncStorage|Alert|Linking|PermissionsAndroid)/.test(code) ||
    /useNativeDriver/.test(code) ||
    /style={styles\..*?}/.test(code) ||
    /onPress=/.test(code) ||
    /import\s+.*?\s+from\s+['"]@react-navigation\//.test(code) ||
    /expo/.test(code)
  ) {
    detectedFrameworks.push("reactnative");
  }

  // Vue
  if (
    /import\s+Vue\s+from\s+['"]vue['"]/.test(code) ||
    /new\s+Vue\s*\({/.test(code) ||
    /Vue\.createApp\s*\(/.test(code) ||
    /v-(?:for|if|else|else-if|bind|on|model|slot|show|cloak|once|pre|html)/.test(
      code,
    ) ||
    /(?:v-bind|v-on):/.test(code) ||
    /[:@][\w-]+/.test(code) ||
    (/export\s+default\s+{/.test(code) &&
      /(?:data|methods|computed|watch|props)\s*:/.test(code)) ||
    /Vue\.(?:component|directive|filter|use|mixin|extend)/.test(code) ||
    /\$(?:refs|emit|on|once|off|set|delete|watch|nextTick)/.test(code) ||
    /(?:beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|beforeDestroy|destroyed)/.test(
      code,
    ) ||
    /<template>/.test(code) ||
    /(?:Vuex|mapState|mapGetters|mapActions|mapMutations)/.test(code) ||
    /(?:VueRouter|router-view|router-link)/.test(code)
  ) {
    detectedFrameworks.push("vue");
  }

  // Angular
  if (
    /@(?:Component|Directive|Pipe|Injectable|NgModule)\s*\(/.test(code) ||
    /import\s+{.*?}\s+from\s+['"]@angular\/(?:core|common|forms|router)['"]/.test(
      code,
    ) ||
    /implements\s+(?:OnInit|OnDestroy|AfterViewInit|OnChanges)/.test(code) ||
    /ng(?:OnInit|OnDestroy|AfterViewInit|OnChanges)\s*\(/.test(code) ||
    /\[(?:ngClass|ngStyle|ngIf|ngFor|ngSwitch)\]/.test(code) ||
    /\((?:click|input|change|submit)\)/.test(code) ||
    /\[\(ngModel\)\]/.test(code) ||
    (/{{.*?}}/.test(code) && /@(?:Input|Output)\s*\(/.test(code)) ||
    /(?:FormBuilder|FormGroup|FormControl|Validators)/.test(code) ||
    /(?:ActivatedRoute|Router|RouterOutlet|RouterLink)/.test(code) ||
    /(?:HttpClient|HttpHeaders|HttpParams)/.test(code) ||
    /(?:BehaviorSubject|Observable|Subscription|pipe)/.test(code)
  ) {
    detectedFrameworks.push("angular");
  }

  // P5.js
  if (
    /function\s+(?:setup|draw|preload|mousePressed|mouseMoved|keyPressed)\s*\(\s*\)\s*{/.test(
      code,
    ) ||
    /createCanvas\s*\(/.test(code) ||
    /background\s*\(/.test(code) ||
    /(?:fill|stroke|ellipse|rect|line|point|triangle|quad|arc|circle)\s*\(/.test(
      code,
    ) ||
    /(?:translate|rotate|scale|push|pop)\s*\(/.test(code) ||
    /(?:frameRate|frameCount|width|height|mouseX|mouseY|key|keyCode)/.test(
      code,
    ) ||
    /(?:loadImage|loadSound|loadModel|loadFont)\s*\(/.test(code) ||
    /(?:createVector|noise|random|map|constrain|dist|lerp)\s*\(/.test(code) ||
    /(?:createSlider|createButton|createInput|createCheckbox|createSelect)\s*\(/.test(
      code,
    ) ||
    /new\s+p5\s*\(/.test(code)
  ) {
    detectedFrameworks.push("p5");
  }

  // Three.js
  if (
    /import\s+.*\s+from\s+['"]three['"]/.test(code) ||
    /THREE\.(?:Scene|PerspectiveCamera|OrthographicCamera|WebGLRenderer)\s*\(/.test(
      code,
    ) ||
    /renderer\.(?:render|setSize)\s*\(/.test(code) ||
    /new\s+THREE\.(?:Mesh|Geometry|BoxGeometry|SphereGeometry|PlaneGeometry|Material|MeshBasicMaterial)\s*\(/.test(
      code,
    ) ||
    /THREE\.(?:Vector3|Matrix4|Quaternion|Euler|Color)\s*\(/.test(code) ||
    /(?:position|rotation|scale)\.set\s*\(/.test(code) ||
    /THREE\.(?:AmbientLight|PointLight|DirectionalLight|SpotLight)\s*\(/.test(
      code,
    ) ||
    /THREE\.(?:TextureLoader|GLTFLoader|ObjectLoader)\s*\(/.test(code) ||
    /THREE\.(?:Clock|Raycaster|Box3|Sphere)\s*\(/.test(code) ||
    /scene\.add\s*\(/.test(code) ||
    (/requestAnimationFrame\s*\(/.test(code) &&
      /renderer\.render\s*\(/.test(code))
  ) {
    detectedFrameworks.push("three");
  }

  return detectedFrameworks;
};
