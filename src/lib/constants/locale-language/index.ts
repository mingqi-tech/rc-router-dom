/**
 * MIT License
 *
 *  Copyright (c) 2021 @mingqi/rc-router-dom YunlongRan<549510622@qq.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

/**
 * 语言枚举
 */
export enum LocaleLanguage {
  ar_EG, // 阿拉伯语
  az_AZ, // 阿塞拜疆语
  bg_BG, // 保加利亚语
  bn_BD, // 孟加拉语（孟加拉国）
  by_BY, // 白俄罗斯语
  ca_ES, // 加泰罗尼亚语
  cs_CZ, // 捷克语
  da_DK, // 丹麦语
  de_DE, // 德语
  el_GR, // 希腊语
  en_GB, // 英语
  en_US, // 英语（美式）
  es_ES, // 西班牙语
  et_EE, // 爱沙尼亚语
  fa_IR, // 波斯语
  fi_FI, // 芬兰语
  fr_BE, // 法语（比利时）
  fr_CA, // 法语（加拿大）
  fr_FR, // 法语（法国）
  ga_IE, // 爱尔兰语
  gl_ES, // 加利西亚语（西班牙）
  he_IL, // 希伯来语
  hi_IN, // 印地语
  hr_HR, // 克罗地亚语
  hu_HU, // 匈牙利语
  hy_AM, // 亚美尼亚
  id_ID, // 印度尼西亚语
  it_IT, // 意大利语
  is_IS, // 冰岛语
  ja_JP, // 日语
  ka_GE, // 格鲁吉亚语
  kmr_IQ, // 北库尔德语
  kn_IN, // 卡纳达语
  kk_KZ, // 哈萨克语
  ko_KR, // 韩语/朝鲜语
  lt_LT, // 立陶宛语
  lv_LV, // 拉脱维亚语
  mk_MK, // 马其顿语
  ml_IN, // 马拉雅拉姆语
  mn_MN, // 蒙古语
  ms_MY, // 马来语 (马来西亚)
  nb_NO, // 挪威语
  ne_NP, // 尼泊尔语
  nl_BE, // 荷兰语（比利时）
  nl_NL, // 荷兰语
  pl_PL, // 波兰语
  pt_BR, // 葡萄牙语(巴西)
  pt_PT, // 葡萄牙语
  ro_RO, // 罗马尼亚语
  ru_RU, // 俄罗斯语
  sk_SK, // 斯洛伐克语
  sr_RS, // 塞尔维亚语
  sl_SI, // 斯洛文尼亚语
  sv_SE, // 瑞典语
  ta_IN, // 泰米尔语
  th_TH, // 泰语
  tr_TR, // 土耳其语
  ur_PK, // 乌尔都语 (巴基斯坦)
  uk_UA, // 乌克兰语
  vi_VN, // 越南语
  zh_CN, // 简体中文
  zh_HK, // 繁体中文（中国香港）
  zh_TW, // 繁体中文（中国台湾）
}

/**
 * 语言key
 */
export type LocaleLanguageKey = keyof typeof LocaleLanguage;
