import RewritingStream from 'parse5-html-rewriting-stream'
import * as htmlRules from './html-rules'
import stream from 'stream'
import Bluebird from 'bluebird'
import { DeferSourceMapRewriteFn } from './js'

// the HTML rewriter passes inline JS to the JS rewriter, hence
// the lack of basic `rewriteHtml` or `HtmlRewriter` exports here

export function HtmlJsRewriter (url: string, deferSourceMapRewrite?: DeferSourceMapRewriteFn): stream.Transform {
  const rewriter = new RewritingStream()

  htmlRules.install(url, rewriter, deferSourceMapRewrite)

  return rewriter
}

export function rewriteHtmlJs (url: string, html: string, deferSourceMapRewrite?: DeferSourceMapRewriteFn): Bluebird<string> {
  let out = ''
  const rewriter = HtmlJsRewriter(url, deferSourceMapRewrite)

  rewriter.on('data', (chunk) => {
    out += chunk
  })

  rewriter.end(html)

  return new Bluebird<string>((resolve) => {
    rewriter.on('end', () => {
      resolve(out)
    })
  })
}
