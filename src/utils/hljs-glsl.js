import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';

// Define GLSL syntax
hljs.registerLanguage('glsl', function(hljs) {
  return {
    case_insensitive: false,
    keywords: {
      keyword: 'attribute const uniform varying break continue do for while if else in out inout float int void bool true false discard return mat2 mat3 mat4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 sampler2D samplerCube struct precision lowp mediump highp invariant layout centroid flat smooth noperspective patch sample subroutine common partition active asm class union enum typedef template this resource goto inline noinline volatile public static extern external interface long short half fixed unsigned superp input output hvec2 hvec3 hvec4 dmat2 dmat3 dmat4 dvec2 dvec3 dvec4 uint usampler2D usamplerCube uvec2 uvec3 uvec4 sampler3D sampler2DShadow sampler2DArray sampler2DArrayShadow isampler2D isampler3D isamplerCube isampler2DArray usampler2D usampler3D usamplerCube usampler2DArray coherent restrict readonly writeonly atomic_uint atomicCounter atomicCounterIncrement atomicCounterDecrement samplerBuffer image2D image3D imageCube iimage2D iimage3D iimageCube uimage2D uimage3D uimageCube imageBuffer iimageBuffer uimageBuffer image1D iimage1D uimage1D image1DArray iimage1DArray uimage1DArray image2DRect iimage2DRect uimage2DRect sampler1D sampler1DShadow sampler1DArray sampler1DArrayShadow isampler1D isampler1DArray usampler1D usampler1DArray sampler2DRect sampler2DRectShadow isampler2DRect usampler2DRect samplerBuffer isamplerBuffer usamplerBuffer sampler2DMS isampler2DMS usampler2DMS sampler2DMSArray isampler2DMSArray usampler2DMSArray image2DMS iimage2DMS uimage2DMS image2DMSArray iimage2DMSArray uimage2DMSArray',
      built_in: 'radians degrees sin cos tan asin acos atan pow exp log exp2 log2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not dFdx dFdy fwidth texture2D texture2DProj texture2DLod texture2DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod'
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'meta',
        begin: '#', end: '$',
        relevance: 2
      }
    ]
  };
});

// Define Arduino syntax (based on C++ with specific functions)
hljs.registerLanguage('arduino', function(hljs) {
  return hljs.getLanguage('cpp');
});

// Define MEL syntax
hljs.registerLanguage('mel', function(hljs) {
  return {
    case_insensitive: false,
    keywords: {
      keyword: 'if else while for break continue global proc return string int float vector matrix',
      built_in: 'print if else for while break continue string int float vector matrix proc'
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'meta',
        begin: '#', end: '$',
        relevance: 2
      }
    ]
  };
});

// Define GSL syntax
hljs.registerLanguage('gsl', function(hljs) {
  return {
    case_insensitive: false,
    keywords: {
      keyword: 'for while if else do return break continue',
      built_in: 'gsl_rng_uniform gsl_rng_get gsl_rng_max gsl_rng_min gsl_rng_set gsl_rng_name gsl_rng_alloc gsl_rng_free gsl_rng_clone gsl_rng_env_setup'
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'meta',
        begin: '#', end: '$',
        relevance: 2
      }
    ]
  };
});

// Register C++ (as it will be used as a base for Arduino)
hljs.registerLanguage('cpp', cpp);

export default hljs;
