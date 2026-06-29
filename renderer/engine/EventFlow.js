/**
 * EventFlow.js — v2.4.2
 * 轻量节奏系统：分步展示事件过程
 * 让玩家"看见变化发生"
 */
export class EventFlow {
  constructor(ui) {
    this.ui = ui;
    this.steps = [];
    this.currentStep = 0;
    this.stepDelay = 400; // 每步延迟（毫秒）
  }

  /**
   * 启动事件流程
   * presented: EventPresenter.present() 的输出
   */
  start(presented) {
    this.steps = this.buildSteps(presented);
    this.currentStep = 0;
    this.runNext();
  }

  /**
   * 构建展示步骤
   */
  buildSteps(presented) {
    const steps = [];

    // Step 1: 事件标题 + 类型标签
    steps.push({
      type: 'title',
      title: presented.title,
      typeLabel: presented.typeLabel,
      rarityClass: presented.rarityClass
    });

    // Step 2: 剧情引入（intro）
    if (presented.intro) {
      steps.push({
        type: 'intro',
        text: presented.intro
      });
    }

    // Step 3: 剧情发展（development）
    if (presented.development) {
      steps.push({
        type: 'development',
        text: presented.development
      });
    }

    // Step 4: 选择后的结果（conclusion）
    if (presented.conclusion) {
      steps.push({
        type: 'conclusion',
        text: presented.conclusion,
        success: presented.success
      });
    }

    // Step 5: 影响展示
    if (presented.impactView && presented.impactView.length > 0) {
      steps.push({
        type: 'impact',
        items: presented.impactView
      });
    }

    // Step 6: Buff 展示
    if (presented.buffView) {
      steps.push({
        type: 'buff',
        buff: presented.buffView,
        source: presented.buffSource
      });
    }

    // Step 7: 功法获取
    if (presented.technique) {
      steps.push({
        type: 'technique',
        text: '获得神秘功法传承！'
      });
    }

    // Step 8: 风味文本（flavor）
    if (presented.flavorText) {
      steps.push({
        type: 'flavor',
        text: presented.flavorText
      });
    }

    return steps;
  }

  /**
   * 执行下一步
   */
  runNext() {
    if (this.currentStep >= this.steps.length) {
      this.onComplete();
      return;
    }

    const step = this.steps[this.currentStep];
    this.renderStep(step);
    this.currentStep++;

    // 延迟执行下一步
    setTimeout(() => this.runNext(), this.stepDelay);
  }

  /**
   * 渲染单步到 UI
   */
  renderStep(step) {
    if (!this.ui) return;
    this.ui.showFlowStep(step);
  }

  /**
   * 流程完成回调
   */
  onComplete() {
    if (this.ui) {
      this.ui.onFlowComplete();
    }
  }

  /**
   * 重置
   */
  reset() {
    this.steps = [];
    this.currentStep = 0;
  }
}
