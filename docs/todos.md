todos:
- cloudflare
  - integrate with cloudflare CI/CD. build on push
  - deploy blogs contents to R2, using sqlite & ffmpeg to compress images

- add cloudflare skills
- Support I18N
- add mermaid support
- add syntax highlighting
- add a self verification method for AI. 
  - the limitation are the free model that opencode provides is not a multimodal. lack image recognition capability
- support bundling on a widget basis then add a global event-bus to communicate these island components
- add a contact widget
- currently the bucket exposed without limitation. find a way to restrict the access.



而且我需要知道 coding agent 是怎么根据用户提示去做的代码变更. 比如如何知道该改哪些文件, 哪个位置, 以及如何应用llm model返回的patch, 以及如何去知道当前的更改通过了, 如何去生成验证手段的流程. 这部分也可以提供代码和画图