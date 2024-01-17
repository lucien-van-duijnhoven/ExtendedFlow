using System;
using System.Collections.Generic;
using Flow.Launcher.Plugin;

namespace Flow.Launcher.Plugin.ExtendedFlow
{
    public class ExtendedFlow : IPlugin
    {
        private PluginInitContext _context;

        public void Init(PluginInitContext context)
        {
            _context = context;
        }

        public List<Result> Query(Query query)
        {
            return new List<Result>
            {
                new Result
                {
                    Title = "Toggle siteblock",
                    SubTitle = "Reroute all the blocked sites to a black page",
                    Action = _ =>
                    {
                        return true;
                    }
                },
                new Result
                {
                    Title = "Toggle monochrome",
                    SubTitle = "Turn on/off monochrome mode",
                    Action = _ =>
                    {
                        return true;
                    }
                },
            };
        }
    }
}