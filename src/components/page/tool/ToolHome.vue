<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>
<i18n>
{
  "zh": {
    "page_intro_tool": "泛VC数据记录与分享相关所需要的辅助工具。"
  },
  "en": {
    "page_intro_tool": "Usefull tools for pan VC data collecting and sharing."
  }
}
</i18n>

<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.tool') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('page_name.home') }}</h1>
      <p>{{ $t('page_intro_tool') }}</p>
      <ul>
        <li>
          <router-link to="/tool/datecalc">{{ $t('tool_info.datecalc.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.datecalc.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/biliapi">{{ $t('tool_info.biliapi.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.biliapi.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/zkcalc">{{ $t('tool_info.zkcalc.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.zkcalc.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/abid">{{ $t('tool_info.abid.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.abid.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/ts">{{ $t('tool_info.ts.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.ts.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/compare">{{ $t('tool_info.compare.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.compare.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/text-abid-description-replacement">{{ $t('tool_info.text-abid-description-replacement.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.text-abid-description-replacement.brief_intro') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolHome",
  data: function() {
    return {

    }
  }
}
</script>
