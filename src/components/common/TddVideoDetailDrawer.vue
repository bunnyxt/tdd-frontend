<template>
  <a-drawer
      :title="'av'+video.aid"
      placement="right"
      :closable="false"
      @close="$emit('close')"
      :visible="visible"
      :width="videoDetailDrawerWidth + 'px'"
  >
    <h3 style="margin-bottom: 14px">{{ video.title }}</h3>
    <p>
      <a-avatar
          size="small"
          :src="video.member
              ? video.member.face
              : 'https://static.hdslb.com/images/member/noface.gif'"
          style="margin-right:12px"
      />
      <a :href="'https://space.bilibili.com/'+video.mid" target="_blank">
        {{ video.member ? video.member.name : 'mid'+video.mid}}
      </a>
    </p>
    <div v-if="video.hasstaff === 1">
      <p>
        <a-collapse>
          <a-collapse-panel :header="'创作团队 ('+video.staff.length+')'">
            <table cellpadding="4px">
              <tr v-for="staff in video.staff" :key="staff.mid">
                <td>
                  <a-avatar
                      size="small"
                      :src="staff.face"
                  />
                </td>
                <td>
                  <a :href="'https://space.bilibili.com/'+staff.mid" target="_blank">
                    {{ staff.name }}
                  </a>
                </td>
                <td>
                  {{ staff.title }}
                </td>
              </tr>
            </table>
          </a-collapse-panel>
        </a-collapse>
      </p>
    </div>
    <p><a-icon type="calendar" style="margin-right: 12px"/>{{ $util.tsToDateString(video.pubdate) }}</p>
    <p><a-icon type="database" style="margin-right: 12px"/>{{ video.tname }}</p>
    <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
    <a-divider orientation="left">简介</a-divider>
    {{ video.desc }}
    <a-divider orientation="left">标签</a-divider>
    <a-tag
        v-for="tag in video.tags
              ? video.tags.split(';').slice(0, -1)
              : []"
        :key="tag"
        style="margin-bottom: 4px"
    >
      {{ tag }}
    </a-tag>
    <a-divider orientation="left">数据</a-divider>
    <div v-if="video.laststat">
      <video-stat-bar
        :stat="video.laststat"
        mode="vertical"
        :show-name="true"
      ></video-stat-bar>
      *{{ $util.tsToDateString(video.laststat.added) }}更新
    </div>
    <div v-else>
      <a-alert type="error" message="暂无数据" />
    </div>
    <div class="drawer-fake-footer"></div>
    <div class="drawer-footer">
      <div @click="videoDetailClickHandler(video.aid)"
           :style="{ width: videoDetailDrawerWidth / 2 + 'px'}">
        <a-icon type="line-chart" title="详细数据" style="margin-right: 8px"/>详细数据
      </div>
      <div @click="videoViewClickHandler(video.aid)"
           :style="{ width: videoDetailDrawerWidth / 2 + 'px'}">
        <a-icon type="play-circle" title="观看视频" style="margin-right: 8px"/>观看视频
      </div>
    </div>
  </a-drawer>
</template>

<script>
  import VideoStatBar from "./VideoStatBar";

  export default {
    name: 'TddVideoDetailDrawer',
    props: {
      video: Object,
      visible: Boolean
    },
    components: {
      VideoStatBar

    },
    data: function () {
      return {
        
      }
    },
    computed: {
      videoDetailDrawerWidth: function() {
        return Math.min(this.$store.state.clientWidth * 0.7, 512);
      }
    },
    methods: {
      videoDetailClickHandler: function (aid) {
        this.$store.commit('changeVideoDetailDrawerVisibility');
        this.$router.push('/video/av' + aid);
      },
      videoViewClickHandler: function(aid) {
        window.open('https://www.bilibili.com/video/av' + aid);
      }
    }
  }
</script>

<style scoped>
  .drawer-fake-footer {
    height: 48px;
  }
  .drawer-footer {
    position: fixed;
    bottom: 0;
    background: #fafafa;
    width: 100%;
    margin-left: -24px;
    border-top: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .drawer-footer div {
    float: left;
    width: 50%;
    height: 48px;
    text-align: center;
    border-left: 1px solid #e8e8e8;
    padding-top: 14px;
  }
  .drawer-footer div:hover {
    background: #e8e8e8;
  }
</style>