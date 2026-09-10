import { useState } from 'react';

export default function WorkflowComparison() {
  // Requirement: Default to "Without Dialora" and let visitor toggle manually
  const [withDialora, setWithDialora] = useState(false);

  const stepsWithout = [
    {
      num: '01',
      title: 'Call Intake & Greeting',
      role: 'Human Bottleneck',
      type: 'human',
      desc: 'Manual pick-up. Long ring delays and high abandonment during peak hours.',
      icon: '📞'
    },
    {
      num: '02',
      title: 'Language & Intent',
      role: 'Rigid IVR Menu',
      type: 'automated',
      desc: '"Press 1 for Sales, Press 2 for Support". High caller frustration and drop-off.',
      icon: '🔢'
    },
    {
      num: '03',
      title: 'Identity & Context',
      role: 'Human Bottleneck',
      type: 'human',
      desc: 'Human tele-caller repeatedly asks caller for name, account ID, and issue details.',
      icon: '🔍'
    },
    {
      num: '04',
      title: 'Query Resolution',
      role: 'Human Bottleneck',
      type: 'human',
      desc: 'Manual lookup across disparate tools. Agent fatigue leads to script drift.',
      icon: '💬'
    },
    {
      num: '05',
      title: 'Edge Exceptions',
      role: 'Human Bottleneck',
      type: 'human',
      desc: 'Escalation to senior supervisors with repeated hold music and dropped calls.',
      icon: '👥'
    },
    {
      num: '06',
      title: 'CRM Disposition',
      role: 'Manual / Delayed',
      type: 'automated',
      desc: 'Incomplete notes logged at end-of-shift, causing missed follow-ups.',
      icon: '📋'
    }
  ];

  const stepsWith = [
    {
      step: '01',
      title: 'Instant Call Intake',
      role: 'Dialora Voice Agent',
      badge: 'Agent',
      badgeColor: 'bg-[#d6f549] text-black font-bold',
      desc: 'Answers on Ring #1 in caller\'s native language. Zero queue hold time.',
      icon: '⚡'
    },
    {
      step: '02',
      title: 'Language & Intent',
      role: 'Neural Speech Engine',
      badge: 'Automated',
      badgeColor: 'bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#93c5fd]',
      desc: 'Classifies Hindi, English, Tamil, Telugu or regional dialects in first 2s.',
      icon: '🌐'
    },
    {
      step: '03',
      title: 'Identity & Memory',
      role: 'Dialora Voice Agent',
      badge: 'Agent',
      badgeColor: 'bg-[#d6f549] text-black font-bold',
      desc: 'Pulls CRM history instantly; remembers previous caller promises & context.',
      icon: '🧠'
    },
    {
      step: '04',
      title: 'Autonomous Resolution',
      role: 'Dialora Voice Agent',
      badge: 'Agent',
      badgeColor: 'bg-[#d6f549] text-black font-bold',
      desc: 'Sub-500ms conversational turn-taking. Handles interruptions naturally.',
      icon: '🎯'
    },
    {
      step: '05',
      title: 'Exception Escalation',
      role: 'Human Specialist',
      badge: 'Warm Handoff',
      badgeColor: 'bg-amber-500/20 border border-amber-500/40 text-amber-300',
      desc: 'Only 15% edge cases handed over to humans with live summary screen pop.',
      icon: '👤'
    },
    {
      step: '06',
      title: 'Real-Time CRM Sync',
      role: 'Webhook Engine',
      badge: 'Automated',
      badgeColor: 'bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#93c5fd]',
      desc: 'Verbatim transcript, extracted entities, and sentiment logged instantly.',
      icon: '✨'
    }
  ];

  return (
    <section className="py-24 px-4 w-full bg-[#080b11] relative overflow-hidden border-t border-white/5">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#245ae2]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
            <span className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wider">
              Workflow Transformation
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            How your operation evolves
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Toggle below to compare traditional human-bottlenecked calling with Dialora’s autonomous continuous loop.
          </p>
        </div>

        {/* Clean Interactive Toggle Switch */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-14 select-none">
          <button
            onClick={() => setWithDialora(false)}
            className={`text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer ${
              !withDialora 
                ? 'text-white border-b-2 border-amber-400 pb-1' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Without Dialora
          </button>

          {/* Toggle Pill Button */}
          <button
            onClick={() => setWithDialora(!withDialora)}
            className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 border ${
              withDialora
                ? 'bg-[#245ae2] border-[#60a5fa] shadow-[0_0_20px_rgba(36,90,226,0.6)]'
                : 'bg-[#141a29] border-white/20'
            }`}
            aria-label="Toggle workflow view"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md ${
                withDialora
                  ? 'translate-x-7 bg-white text-[#245ae2]'
                  : 'translate-x-0 bg-slate-300 text-slate-800'
              }`}
            >
              {withDialora ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => setWithDialora(true)}
            className={`text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer ${
              withDialora 
                ? 'text-[#60a5fa] border-b-2 border-[#245ae2] pb-1' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            With Dialora
          </button>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: WITHOUT DIALORA (Clean Linear Bottleneck Architecture) */}
        {/* ============================================================ */}
        {!withDialora && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            
            {/* Warning Pill Banner */}
            <div className="w-full max-w-4xl mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs sm:text-sm text-amber-300">
              <span className="text-lg">⚠️</span>
              <div>
                <strong className="text-amber-200">Linear Bottleneck Chain:</strong> 4 out of 6 call stages require human tele-callers. High call queues, script drift, and 20%+ dropped call rates during surges.
              </div>
            </div>

            {/* 6 Clear Steps Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {stepsWithout.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#0f1422] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-slate-500 font-bold">Step {step.num}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        step.type === 'human'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}>
                        {step.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-xl">{step.icon}</span>
                      <h3 className="text-base font-bold text-white tracking-tight">{step.title}</h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Vulnerability</span>
                    <span className={step.type === 'human' ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                      {step.type === 'human' ? 'Human Queue Risk' : 'Static Menu'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Impact Bar */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-xl font-bold text-amber-400 mb-1">8 - 14 Mins</div>
                <div className="text-xs text-slate-400">Average Customer Wait Time</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-xl font-bold text-rose-400 mb-1">22% Dropped</div>
                <div className="text-xs text-slate-400">Peak Hour Abandonment Rate</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-xl font-bold text-slate-300 mb-1">Linear Scaling</div>
                <div className="text-xs text-slate-400">More Calls = More Salaries</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: WITH DIALORA (Clean, Uncluttered Autonomous Loop)     */}
        {/* ============================================================ */}
        {withDialora && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            
            {/* Success Pill Banner */}
            <div className="w-full max-w-4xl mb-8 p-4 rounded-2xl bg-[#245ae2]/15 border border-[#245ae2]/40 flex items-center gap-3 text-xs sm:text-sm text-[#93c5fd]">
              <span className="text-lg">⚡</span>
              <div>
                <strong className="text-white">Continuous Autonomous Loop:</strong> 85%+ calls resolved end-to-end by Dialora Voice Agents. Sub-500ms conversation latency, zero queue delays, and real-time CRM updates.
              </div>
            </div>

            {/* Structured Continuous Flow Circuit Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {stepsWith.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#0d121f] border border-[#245ae2]/30 rounded-2xl p-5 flex flex-col justify-between hover:border-[#245ae2]/60 hover:shadow-[0_0_30px_rgba(36,90,226,0.2)] transition-all shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#245ae2]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#245ae2]/20 transition-all" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-[#60a5fa] font-bold">Stage {step.step}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-xl">{step.icon}</span>
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#60a5fa] transition-colors">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-1">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Engine</span>
                    <span className="text-[#93c5fd] font-medium">{step.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Outcomes Bar */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-black/40 border border-[#245ae2]/30 shadow-md">
                <div className="text-xl font-bold text-[#d6f549] mb-1">&lt;500ms</div>
                <div className="text-xs text-slate-300">Voice Response Turnaround</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-[#245ae2]/30 shadow-md">
                <div className="text-xl font-bold text-white mb-1">85%+ First Call</div>
                <div className="text-xs text-slate-300">Autonomous Resolution Rate</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-[#245ae2]/30 shadow-md">
                <div className="text-xl font-bold text-[#60a5fa] mb-1">0 Sec Hold</div>
                <div className="text-xs text-slate-300">Parallel Calling Capacity</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
