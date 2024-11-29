import { categories } from "../data/categories";


type CategoryKey = keyof typeof categories;

const frameworks = [
  {
    key: "reactjs",
    tests: [
      /import\s+(?:React|{.*?})\s+from\s+['"]react['"]/,
      /<[A-Z][A-Za-z]*\s+/,
      /className=/,
      /use(?:State|Effect|Context|Reducer|Callback|Memo|Ref)\s*\(/,
      /React\.(?:createElement|cloneElement|createRef|Fragment)/,
      /ReactDOM\.(?:render|hydrate|createPortal)/,
      /(?:componentDidMount|componentDidUpdate|componentWillUnmount)/,
      /(?:getDerivedStateFromProps|getSnapshotBeforeUpdate)/,
      /shouldComponentUpdate/,
      /(?:mapStateToProps|mapDispatchToProps)/,
      /<(?:Fragment|Suspense|ErrorBoundary)>/,
    ],
  },
  {
    key: "reactnative",
    tests: [
      /import\s+.*?\s+from\s+['"]react-native['"]/,
      /<(?:View|Text|Image|ScrollView|FlatList|TouchableOpacity|TextInput)\s/,
      /StyleSheet\.create\(/,
      /(?:Animated|Easing|LayoutAnimation)/,
      /(?:AppRegistry|Platform|Dimensions)/,
      /(?:AsyncStorage|Alert|Linking|PermissionsAndroid)/,
      /useNativeDriver/,
      /style={styles\..*?}/,
      /onPress=/,
      /import\s+.*?\s+from\s+['"]@react-navigation\//,
      /expo/,
    ],
  },
  {
    key: "vue",
    tests: [
      /import\s+Vue\s+from\s+['"]vue['"]/,
      /new\s+Vue\s*\({/,
      /Vue\.createApp\s*\(/,
      /v-(?:for|if|else|else-if|bind|on|model|slot|show|cloak|once|pre|html)/,
      /(?:v-bind|v-on):/,
      /[:@][\w-]+/,
      /export\s+default\s+{/,
      /(?:data|methods|computed|watch|props)\s*:/,
      /Vue\.(?:component|directive|filter|use|mixin|extend)/,
      /\$(?:refs|emit|on|once|off|set|delete|watch|nextTick)/,
      /(?:beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|beforeDestroy|destroyed)/,
      /<template>/,
      /(?:Vuex|mapState|mapGetters|mapActions|mapMutations)/,
      /(?:VueRouter|router-view|router-link)/,
    ],
  },
  {
    key: "angular",
    tests: [
      /@(?:Component|Directive|Pipe|Injectable|NgModule)\s*\(/,
      /import\s+{.*?}\s+from\s+['"]@angular\/(?:core|common|forms|router)['"]/,
      /implements\s+(?:OnInit|OnDestroy|AfterViewInit|OnChanges)/,
      /ng(?:OnInit|OnDestroy|AfterViewInit|OnChanges)\s*\(/,
      /\[(?:ngClass|ngStyle|ngIf|ngFor|ngSwitch)\]/,
      /\((?:click|input|change|submit)\)/,
      /\[\(ngModel\)\]/,
      /{{.*?}}/,
      /@(?:Input|Output)\s*\(/,
      /(?:FormBuilder|FormGroup|FormControl|Validators)/,
      /(?:ActivatedRoute|Router|RouterOutlet|RouterLink)/,
      /(?:HttpClient|HttpHeaders|HttpParams)/,
      /(?:BehaviorSubject|Observable|Subscription|pipe)/,
    ],
  },
  {
    key: "p5",
    tests: [
      /function\s+(?:setup|draw|preload|mousePressed|mouseMoved|keyPressed)\s*\(\s*\)\s*{/,
      /createCanvas\s*\(/,
      /background\s*\(/,
      /(?:fill|stroke|ellipse|rect|line|point|triangle|quad|arc|circle)\s*\(/,
      /(?:translate|rotate|scale|push|pop)\s*\(/,
      /(?:frameRate|frameCount|width|height|mouseX|mouseY|key|keyCode)/,
      /(?:loadImage|loadSound|loadModel|loadFont)\s*\(/,
      /(?:createVector|noise|random|map|constrain|dist|lerp)\s*\(/,
      /(?:createSlider|createButton|createInput|createCheckbox|createSelect)\s*\(/,
      /new\s+p5\s*\(/,
    ],
  },
  {
    key: "three",
    tests: [
      /import\s+.*\s+from\s+['"]three['"]/,
      /THREE\.(?:Scene|PerspectiveCamera|OrthographicCamera|WebGLRenderer)\s*\(/,
      /renderer\.(?:render|setSize)\s*\(/,
      /new\s+THREE\.(?:Mesh|Geometry|BoxGeometry|SphereGeometry|PlaneGeometry|Material|MeshBasicMaterial)\s*\(/,
      /THREE\.(?:Vector3|Matrix4|Quaternion|Euler|Color)\s*\(/,
      /(?:position|rotation|scale)\.set\s*\(/,
      /THREE\.(?:AmbientLight|PointLight|DirectionalLight|SpotLight)\s*\(/,
      /THREE\.(?:TextureLoader|GLTFLoader|ObjectLoader)\s*\(/,
      /THREE\.(?:Clock|Raycaster|Box3|Sphere)\s*\(/,
      /scene\.add\s*\(/,
      /requestAnimationFrame\s*\(/,
      /renderer\.render\s*\(/,
    ],
  },
  {
    key: "svelte",
    tests: [
      /<script>/,
      /export\s+let\s+\w+/,
      /bind:this/,
      /{@html\s+\w+}/,
      /{@if\s+.*}/,
      /{@each\s+.*\s+as\s+.*}/,
      /{@await\s+.*}/,
      /<svelte:component\s+this=/,
      /<svelte:window\s+on:/,
      /<svelte:body\s+on:/,
      /<svelte:head>/,
      /<svelte:options\s+/,
      /<svelte:self>/,
      /<svelte:fragment>/,
    ],
  },
];

export const detectFrameworks = (code: string): CategoryKey[] => {
  const detectedFrameworks: { key: CategoryKey; count: number }[] = [];

  frameworks.forEach(({ key, tests }) => {
    const matchCount = tests.reduce(
      (count, test) => (test.test(code) ? count + 1 : count),
      0,
    );
    if (matchCount > 1) {
      detectedFrameworks.push({ key: key as CategoryKey, count: matchCount });
    }
  });

  return detectedFrameworks
    .sort((a, b) => b.count - a.count)
    .map((framework) => framework.key);
};
